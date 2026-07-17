import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export function AdminHomePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Panoramica operativa del negozio.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ordini oggi</CardDescription>
            <CardTitle>—</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default">In arrivo</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Fatturato</CardDescription>
            <CardTitle>—</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default">In arrivo</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Prodotti</CardDescription>
            <CardTitle>Gestione catalogo</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="brand">CRUD attivo</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Clienti</CardDescription>
            <CardTitle>—</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default">In arrivo</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

