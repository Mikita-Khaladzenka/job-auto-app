import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Setup() {
  const { user, isAuthenticated } = useAuth();
  const [olxEmail, setOlxEmail] = useState("");
  const [olxPassword, setOlxPassword] = useState("");
  const [pracujEmail, setPracujEmail] = useState("");
  const [pracujPassword, setPracujPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const saveOlxCredentials = trpc.portal.saveCredentials.useMutation();
  const savePracujCredentials = trpc.portal.saveCredentials.useMutation();
  const getCredentials = trpc.portal.getCredentials.useQuery();
  const updateProfile = trpc.profile.update.useMutation();
  const getProfile = trpc.profile.get.useQuery();

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

  const handleSaveOLX = async () => {
    if (!olxEmail || !olxPassword) {
      toast.error("Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      await saveOlxCredentials.mutateAsync({
        portal: "olx",
        email: olxEmail,
        password: olxPassword,
      });
      toast.success("Dane logowania OLX zapisane");
      setOlxEmail("");
      setOlxPassword("");
      getCredentials.refetch();
    } catch (error) {
      toast.error("Błąd podczas zapisywania danych");
    }
  };

  const handleSavePracuj = async () => {
    if (!pracujEmail || !pracujPassword) {
      toast.error("Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      await savePracujCredentials.mutateAsync({
        portal: "pracuj",
        email: pracujEmail,
        password: pracujPassword,
      });
      toast.success("Dane logowania Pracuj zapisane");
      setPracujEmail("");
      setPracujPassword("");
      getCredentials.refetch();
    } catch (error) {
      toast.error("Błąd podczas zapisywania danych");
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !phone) {
      toast.error("Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      await updateProfile.mutateAsync({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        cv: undefined,
        coverLetterTemplate: undefined,
      });
      toast.success("Profil zaktualizowany");
      getProfile.refetch();
    } catch (error) {
      toast.error("Błąd podczas aktualizacji profilu");
    }
  };

  const hasOLXCredentials = getCredentials.data?.some((c) => c.portal === "olx");
  const hasPracujCredentials = getCredentials.data?.some((c) => c.portal === "pracuj");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Konfiguracja</h1>
          <p className="text-slate-600">
            Skonfiguruj swoje konto i dane logowania do portali pracy
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="olx">OLX.pl</TabsTrigger>
            <TabsTrigger value="pracuj">Pracuj.pl</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Twój profil</CardTitle>
                <CardDescription>
                  Informacje będą używane do wypełniania formularzy aplikacji
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      placeholder="Jan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      placeholder="Kowalski"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <Input
                    id="phone"
                    placeholder="+48 123 456 789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfile.isPending}
                  className="w-full"
                >
                  {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Zapisz profil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OLX Tab */}
          <TabsContent value="olx">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  OLX.pl
                  {hasOLXCredentials && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </CardTitle>
                <CardDescription>
                  Dodaj swoje dane logowania do OLX.pl
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="olxEmail">Email</Label>
                  <Input
                    id="olxEmail"
                    type="email"
                    placeholder="twoj@email.com"
                    value={olxEmail}
                    onChange={(e) => setOlxEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="olxPassword">Hasło</Label>
                  <Input
                    id="olxPassword"
                    type="password"
                    placeholder="••••••••"
                    value={olxPassword}
                    onChange={(e) => setOlxPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Twoje hasło jest szyfrowane i bezpiecznie przechowywane. Nigdy nie jest wysyłane do żadnych zewnętrznych serwisów.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSaveOLX}
                  disabled={saveOlxCredentials.isPending}
                  className="w-full"
                >
                  {saveOlxCredentials.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Zapisz dane OLX
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pracuj Tab */}
          <TabsContent value="pracuj">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Pracuj.pl
                  {hasPracujCredentials && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </CardTitle>
                <CardDescription>
                  Dodaj swoje dane logowania do Pracuj.pl
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pracujEmail">Email</Label>
                  <Input
                    id="pracujEmail"
                    type="email"
                    placeholder="twoj@email.com"
                    value={pracujEmail}
                    onChange={(e) => setPracujEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pracujPassword">Hasło</Label>
                  <Input
                    id="pracujPassword"
                    type="password"
                    placeholder="••••••••"
                    value={pracujPassword}
                    onChange={(e) => setPracujPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Twoje hasło jest szyfrowane i bezpiecznie przechowywane. Nigdy nie jest wysyłane do żadnych zewnętrznych serwisów.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSavePracuj}
                  disabled={savePracujCredentials.isPending}
                  className="w-full"
                >
                  {savePracujCredentials.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Zapisz dane Pracuj
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Link href="/search">
            <Button size="lg" className="w-full">
              Przejdź do wyszukiwania
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
