import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Briefcase, Zap, BarChart3, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-lg text-slate-900">JobAutoApp</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user?.name || user?.email}</span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/setup">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Konfiguracja
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Dodaj swoje dane logowania do OLX i Pracuj
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/search">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    Wyszukiwanie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Uruchom automatyczne wyszukiwanie i aplikowanie
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Statystyki
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Przeglądaj historię i statystyki aplikacji
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-white" />
            <span className="font-bold text-lg text-white">JobAutoApp</span>
          </div>
        </div>
      </nav>

      <main className="container max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Automatyzuj swoje aplikacje
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Inteligentne narzędzie do automatycznego wyszukiwania i aplikowania na oferty pracy na OLX.pl i Pracuj.pl
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              Zaloguj się i zacznij
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Szybkie wyszukiwanie</h3>
            <p className="text-blue-100">
              Automatycznie przeszukuj portale pracy i aplikuj na oferty spełniające Twoje kryteria
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bezpieczne</h3>
            <p className="text-blue-100">
              Twoje dane logowania są szyfrowane i bezpiecznie przechowywane
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Statystyki</h3>
            <p className="text-blue-100">
              Śledź historię aplikacji i analizuj wyniki wyszukiwania
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
