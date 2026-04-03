import { chromium, Browser } from "playwright";
import { OLXScraper } from "./scrapers/olx";
import { PracujScraper } from "./scrapers/pracuj";
import { decryptPassword } from "./encryption";
import { getDb } from "./db";
import { jobOffers, jobApplications, portalCredentials } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export class JobAutomationService {
  private browser: Browser | null = null;
  private olxScraper: OLXScraper | null = null;
  private pracujScraper: PracujScraper | null = null;

  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.olxScraper = new OLXScraper();
    this.pracujScraper = new PracujScraper();

    if (this.browser && this.olxScraper) {
      await this.olxScraper.initialize(this.browser);
    }
    if (this.browser && this.pracujScraper) {
      await this.pracujScraper.initialize(this.browser);
    }
  }

  async searchAndApply(
    userId: number,
    portal: "olx" | "pracuj" | "both",
    position: string,
    location: string,
    formData: Record<string, string>
  ): Promise<{ applied: number; failed: number; errors: string[] }> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const errors: string[] = [];
    let applied = 0;
    let failed = 0;

    try {
      // Get credentials
      const credentials = await db
        .select()
        .from(portalCredentials)
        .where(and(eq(portalCredentials.userId, userId), eq(portalCredentials.isActive, 1)));

      const portalsToSearch = portal === "both" ? ["olx", "pracuj"] : [portal];

      for (const currentPortal of portalsToSearch) {
        const cred = credentials.find((c) => c.portal === currentPortal);
        if (!cred) {
          errors.push(`No credentials found for ${currentPortal}`);
          continue;
        }

        try {
          const password = decryptPassword(cred.passwordEncrypted);

          if (currentPortal === "olx" && this.olxScraper) {
            const isLoggedIn = await this.olxScraper.login(cred.email, password);
            if (!isLoggedIn) {
              errors.push("Failed to login to OLX");
              continue;
            }

            const offers = await this.olxScraper.searchJobs(position, location);

            for (const offer of offers) {
              // Check if already applied
              const existing = await db
                .select()
                .from(jobApplications)
                .where(
                  and(
                    eq(jobApplications.userId, userId),
                    eq(jobApplications.portal, "olx")
                  )
                )
                .limit(1);

              if (existing.length > 0) {
                continue;
              }

              // Save offer to database
              const savedOffer = await db.insert(jobOffers).values({
                userId,
                portal: "olx",
                externalId: offer.externalId,
                title: offer.title,
                company: offer.company,
                location: offer.location,
                description: offer.description,
                url: offer.url,
                salary: offer.salary,
              });

              // Apply for job
              const success = await this.olxScraper.applyForJob(offer.url, formData);

              if (success) {
                await db.insert(jobApplications).values({
                  userId,
                  offerId: (savedOffer as any).insertId,
                  portal: "olx",
                  status: "submitted",
                  appliedAt: new Date(),
                });
                applied++;
              } else {
                await db.insert(jobApplications).values({
                  userId,
                  offerId: (savedOffer as any).insertId,
                  portal: "olx",
                  status: "failed",
                  errorMessage: "Application submission failed",
                });
                failed++;
              }
            }
          } else if (currentPortal === "pracuj" && this.pracujScraper) {
            const isLoggedIn = await this.pracujScraper.login(cred.email, password);
            if (!isLoggedIn) {
              errors.push("Failed to login to Pracuj");
              continue;
            }

            const offers = await this.pracujScraper.searchJobs(position, location);

            for (const offer of offers) {
              // Check if already applied
              const existing = await db
                .select()
                .from(jobApplications)
                .where(
                  and(
                    eq(jobApplications.userId, userId),
                    eq(jobApplications.portal, "pracuj")
                  )
                )
                .limit(1);

              if (existing.length > 0) {
                continue;
              }

              // Save offer to database
              const savedOffer = await db.insert(jobOffers).values({
                userId,
                portal: "pracuj",
                externalId: offer.externalId,
                title: offer.title,
                company: offer.company,
                location: offer.location,
                description: offer.description,
                url: offer.url,
                salary: offer.salary,
              });

              // Apply for job
              const success = await this.pracujScraper.applyForJob(offer.url, formData);

              if (success) {
                await db.insert(jobApplications).values({
                  userId,
                  offerId: (savedOffer as any).insertId,
                  portal: "pracuj",
                  status: "submitted",
                  appliedAt: new Date(),
                });
                applied++;
              } else {
                await db.insert(jobApplications).values({
                  userId,
                  offerId: (savedOffer as any).insertId,
                  portal: "pracuj",
                  status: "failed",
                  errorMessage: "Application submission failed",
                });
                failed++;
              }
            }
          }
        } catch (error) {
          errors.push(`Error processing ${currentPortal}: ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Service error: ${error}`);
    }

    return { applied, failed, errors };
  }

  async close() {
    if (this.olxScraper) {
      await this.olxScraper.close();
    }
    if (this.pracujScraper) {
      await this.pracujScraper.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}
