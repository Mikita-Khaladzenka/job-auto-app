import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { CheckCircle2, XCircle, Clock, Briefcase, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const getHistory = trpc.applications.getHistory.useQuery();
  const getStats = trpc.applications.getStats.useQuery();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "Wysłana";
      case "failed":
        return "Błąd";
      case "pending":
        return "Oczekująca";
      default:
        return "Nieznany";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Przeglądaj historię i statystyki swoich aplikacji
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Razem aplikacji</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{getStats.data?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Wysłane</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{getStats.data?.submitted || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600">Oczekujące</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{getStats.data?.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Błędy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{getStats.data?.failed || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Historia aplikacji</CardTitle>
            <CardDescription>
              {getHistory.data?.length || 0} aplikacji w bazie danych
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getHistory.isLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Ładowanie...</p>
              </div>
            ) : getHistory.data && getHistory.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Stanowisko</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Firma</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Portal</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getHistory.data.map((app) => (
                      <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <a
                            href={app.offer?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {app.offer?.title || "Nieznane"}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{app.offer?.company || "-"}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">
                            {app.portal}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(app.status)}
                            <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                              {getStatusLabel(app.status)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {app.appliedAt
                            ? format(new Date(app.appliedAt), "dd MMM yyyy", { locale: pl })
                            : format(new Date(app.createdAt), "dd MMM yyyy", { locale: pl })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">Brak aplikacji w historii</p>
                <Link href="/search">
                  <Button>Uruchom wyszukiwanie</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/search">
            <Button className="w-full" size="lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Nowe wyszukiwanie
            </Button>
          </Link>
          <Link href="/setup">
            <Button variant="outline" className="w-full" size="lg">
              Ustawienia
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
