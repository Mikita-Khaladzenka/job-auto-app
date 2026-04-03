import { Page, Browser } from "playwright";

export interface OLXJobOffer {
  externalId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
}

export class OLXScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(browser: Browser) {
    this.browser = browser;
    this.page = await browser.newPage();
  }

  async login(email: string, password: string): Promise<boolean> {
    if (!this.page) throw new Error("Scraper not initialized");

    try {
      await this.page.goto("https://www.olx.pl/", { waitUntil: "networkidle" });

      // Look for login button
      const loginButton = await this.page.$('a[href*="login"]');
      if (loginButton) {
        await loginButton.click();
        await this.page.waitForNavigation({ waitUntil: "networkidle" });
      }

      // Fill email
      await this.page.fill('input[type="email"]', email);
      await this.page.fill('input[type="password"]', password);

      // Click login button
      await this.page.click('button[type="submit"]');
      await this.page.waitForNavigation({ waitUntil: "networkidle" });

      // Check if login was successful
      const isLoggedIn = await this.page.$('[data-testid="user-menu"]');
      return !!isLoggedIn;
    } catch (error) {
      console.error("OLX login error:", error);
      return false;
    }
  }

  async searchJobs(
    position: string,
    location: string,
    keywords?: string
  ): Promise<OLXJobOffer[]> {
    if (!this.page) throw new Error("Scraper not initialized");

    try {
      // Navigate to jobs section
      let searchUrl = `https://www.olx.pl/praca/?search[text]=${encodeURIComponent(position)}`;

      if (location) {
        searchUrl += `&search[filter_enum_city][]=${encodeURIComponent(location)}`;
      }

      await this.page.goto(searchUrl, { waitUntil: "networkidle" });

      // Wait for job listings to load
      await this.page.waitForSelector('[data-testid="listing-item"]', { timeout: 10000 });

      // Extract job offers
      const offers = await this.page.$$eval('[data-testid="listing-item"]', (elements) =>
        elements.map((el) => {
          const titleEl = el.querySelector('h2, h3, [data-testid="listing-title"]');
          const linkEl = el.querySelector('a[href*="/praca/"]');
          const companyEl = el.querySelector('[data-testid="listing-company"]');
          const locationEl = el.querySelector('[data-testid="listing-location"]');
          const salaryEl = el.querySelector('[data-testid="listing-salary"]');

          return {
            title: titleEl?.textContent?.trim() || "",
            url: linkEl?.getAttribute("href") || "",
            company: companyEl?.textContent?.trim() || "",
            location: locationEl?.textContent?.trim() || "",
            salary: salaryEl?.textContent?.trim(),
          };
        })
      );

      // Enrich with descriptions and external IDs
      const enrichedOffers: OLXJobOffer[] = [];

      for (const offer of offers) {
        if (!offer.url) continue;

        try {
          await this.page.goto(offer.url, { waitUntil: "networkidle", timeout: 15000 });

          const description = await this.page.$eval(
            '[data-testid="ad-description"], .ad-description, [class*="description"]',
            (el) => el.textContent?.trim() || ""
          ).catch(() => "");

          const externalId = offer.url.split("/").pop() || "";

          enrichedOffers.push({
            externalId,
            title: offer.title,
            company: offer.company,
            location: offer.location,
            description,
            url: offer.url,
            salary: offer.salary,
          });
        } catch (error) {
          console.error("Error enriching OLX offer:", error);
        }
      }

      return enrichedOffers;
    } catch (error) {
      console.error("OLX search error:", error);
      return [];
    }
  }

  async applyForJob(jobUrl: string, formData: Record<string, string>): Promise<boolean> {
    if (!this.page) throw new Error("Scraper not initialized");

    try {
      await this.page.goto(jobUrl, { waitUntil: "networkidle" });

      // Look for apply button
      const applyButton = await this.page.$('button[data-testid*="apply"], button:has-text("Aplikuj")');

      if (!applyButton) {
        console.log("No apply button found on OLX");
        return false;
      }

      await applyButton.click();
      await this.page.waitForTimeout(1000);

      // Fill form fields
      const inputs = await this.page.$$("input, textarea");

      for (const input of inputs) {
        const name = await input.getAttribute("name");
        const placeholder = await input.getAttribute("placeholder");
        const label = await input.getAttribute("aria-label");

        const fieldName = name || placeholder || label || "";

        if (fieldName.toLowerCase().includes("name")) {
          await input.fill(formData.name || "");
        } else if (fieldName.toLowerCase().includes("email")) {
          await input.fill(formData.email || "");
        } else if (fieldName.toLowerCase().includes("phone")) {
          await input.fill(formData.phone || "");
        }
      }

      // Submit form
      const submitButton = await this.page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await this.page.waitForTimeout(2000);
        return true;
      }

      return false;
    } catch (error) {
      console.error("OLX apply error:", error);
      return false;
    }
  }

  async close() {
    if (this.page) {
      await this.page.close();
    }
  }
}
