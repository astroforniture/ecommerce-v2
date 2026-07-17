import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Clienti</h1>
        <p className="mt-1 text-sm text-slate-600">
          Elenco clienti e dettagli (placeholder).
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>In sviluppo</CardTitle>
          <CardDescription>
            Qui potrai gestire clienti, indirizzi e cronologia ordini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">
            Prossimo step: collegare questa vista al database e alle tabelle
            `User` / `Order`.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

