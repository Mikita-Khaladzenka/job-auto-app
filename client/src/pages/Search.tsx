import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, MapPin, Briefcase } from "lucide-react";
import { Link } from "wouter";

export default function Search() {
  const { user, isAuthenticated } = useAuth();
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [portal, setPortal] = useState<"olx" | "pracuj" | "both">("both");

  const runSearch = trpc.search.runSearch.useMutation();
  const getCredentials = trpc.portal.getCredentials.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Wymagane logowanie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Musisz być zalogowany, aby uzyskać dostęp do tej strony.
            </p>
            <Link href="/">
              <Button className="w-full">Powrót do strony głównej</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasRequiredCredentials =
    (portal === "olx" && getCredentials.data?.some((c) => c.portal === "olx")) ||
    (portal === "pracuj" && getCredentials.data?.some((c) => c.portal === "pracuj")) ||
    (portal === "both" &&
      getCredentials.data?.some((c) => c.portal === "olx") &&
      getCredentials.data?.some((c) => c.portal === "pracuj"));

  const handleSearch = async () => {
    if (!position || !location) {
      toast.error("Proszę wypełnić wszystkie pola");
      return;
    }

    if (!hasRequiredCredentials) {
      toast.error("Proszę skonfigurować dane logowania do wybranych portali");
      return;
    }

    try {
      const result = await runSearch.mutateAsync({
        portal,
        position,
        location,
      });

      toast.success(
        `Wyszukiwanie zakończone! Aplikacji wysłanych: ${result.applied}, Błędów: ${result.failed}`
      );

      if (result.errors.length > 0) {
        result.errors.forEach((error) => toast.error(error));
      }
    } catch (error) {
      toast.error("Błąd podczas wyszukiwania");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Wyszukiwanie ofert</h1>
          <p className="text-slate-600">
            Automatycznie wyszukaj i aplikuj na oferty pracy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Kryteria wyszukiwania</CardTitle>
                <CardDescription>
                  Podaj stanowisko i lokalizację do wyszukania
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="position">Stanowisko</Label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="position"
                      placeholder="np. Frontend Developer, Project Manager"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Lokalizacja</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="location"
                      placeholder="np. Warszawa, Kraków, Zdalnie"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="portal">Portal</Label>
                  <Select value={portal} onValueChange={(value: any) => setPortal(value)}>
                    <SelectTrigger id="portal" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="olx">OLX.pl</SelectItem>
                      <SelectItem value="pracuj">Pracuj.pl</SelectItem>
                      <SelectItem value="both">Oba portale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={runSearch.isPending || !hasRequiredCredentials}
                  size="lg"
                  className="w-full"
                >
                  {runSearch.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {runSearch.isPending ? "Wyszukiwanie..." : "Uruchom wyszukiwanie"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  {getCredentials.data?.some((c) => c.portal === "olx") ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">OLX.pl</p>
                    <p className="text-xs text-slate-600">
                      {getCredentials.data?.some((c) => c.portal === "olx")
                        ? "Skonfigurowano"
                        : "Brak konfiguracji"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {getCredentials.data?.some((c) => c.portal === "pracuj") ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Pracuj.pl</p>
                    <p className="text-xs text-slate-600">
                      {getCredentials.data?.some((c) => c.portal === "pracuj")
                        ? "Skonfigurowano"
                        : "Brak konfiguracji"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wskazówki</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p>
                  • Upewnij się, że skonfigurowałeś dane logowania
                </p>
                <p>
                  • Aplikacja automatycznie sprawdzi duplikaty
                </p>
                <p>
                  • Proces może potrwać kilka minut
                </p>
              </CardContent>
            </Card>

            <Link href="/setup">
              <Button variant="outline" className="w-full">
                Konfiguracja
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              Przejdź do statystyk
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
