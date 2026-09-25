import type { ColumnDef } from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  customersToCsv,
  fetchCustomersForAdmin,
  type AdminCustomer,
} from "../../api/customersSupabase";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { DataTable } from "../../components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

const dtf = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "short",
  timeStyle: "short",
});

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

function formatDate(input?: string | null): string {
  if (!input) return "—";
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? "—" : dtf.format(d);
}

function formatAddress(parts: {
  street?: string;
  zip?: string;
  city?: string;
  province?: string;
}): string {
  const line = [
    parts.street,
    [parts.zip, parts.city].filter(Boolean).join(" "),
    parts.province,
  ]
    .map((v) => (v ?? "").trim())
    .filter(Boolean);
  return line.length > 0 ? line.join(", ") : "Indirizzo non registrato";
}

function downloadCsv(customers: AdminCustomer[]) {
  const csv = customersToCsv(customers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clienti-astro-forniture-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminCustomer | null>(null);

  const customersQuery = useQuery({
    queryKey: ["admin-customers"],
    queryFn: fetchCustomersForAdmin,
    staleTime: 30_000,
  });

  const customers = customersQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const haystack = [
        c.fullName,
        c.firstName,
        c.lastName,
        c.email,
        c.companyName,
        c.phone,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [customers, search]);

  const columns = useMemo<ColumnDef<AdminCustomer>[]>(
    () => [
      {
        id: "customer",
        header: "Cliente",
        cell: ({ row }) => (
          <div className="min-w-[12rem]">
            <div className="font-medium text-slate-900">{row.original.fullName}</div>
            <div className="text-xs text-slate-500">{row.original.email || "Email assente"}</div>
          </div>
        ),
      },
      {
        accessorKey: "registeredAt",
        header: "Data registrazione",
        cell: ({ row }) => (
          <span className="text-slate-700">{formatDate(row.original.registeredAt)}</span>
        ),
      },
      {
        accessorKey: "ordersCount",
        header: () => <div className="text-right">Ordini totali</div>,
        cell: ({ row }) => (
          <div className="text-right tabular-nums text-slate-800">{row.original.ordersCount}</div>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: () => <div className="text-right">Spesa totale</div>,
        cell: ({ row }) => (
          <div className="text-right font-semibold tabular-nums text-slate-900">
            {eur.format(row.original.totalSpent)}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Stato",
        cell: ({ row }) => <Badge variant="success">{row.original.status}</Badge>,
      },
      {
        id: "actions",
        header: "Azioni",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelected(row.original)}
          >
            Dettagli
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clienti</h1>
          <p className="mt-1 text-sm text-slate-600">
            Clienti registrati da Supabase (`profiles`) con ordini aggregati.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={filtered.length === 0}
          onClick={() => downloadCsv(filtered)}
        >
          <Download className="size-4" />
          Esporta CSV
        </Button>
      </header>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Elenco clienti</CardTitle>
            <CardDescription>
              {customersQuery.isPending
                ? "Caricamento…"
                : `${filtered.length} di ${customers.length} clienti`}
            </CardDescription>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per nome o email…"
              className="pl-9"
              aria-label="Cerca clienti per nome o email"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filtered} />
          {customersQuery.isError ? (
            <p className="mt-3 text-sm font-medium text-red-700" role="alert">
              {(customersQuery.error as Error)?.message ??
                "Errore nel caricamento clienti"}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => (!open ? setSelected(null) : null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.fullName ?? "Dettaglio cliente"}</DialogTitle>
            <DialogDescription>
              Cronologia ordini e indirizzi di spedizione.
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Email:</span>{" "}
                  {selected.email || "—"}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Telefono:</span>{" "}
                  {selected.phone || "—"}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Registrazione:</span>{" "}
                  {formatDate(selected.registeredAt)}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Spesa totale:</span>{" "}
                  {eur.format(selected.totalSpent)} ({selected.ordersCount} ordini)
                </p>
                {selected.companyName ? (
                  <p className="text-sm text-slate-700 sm:col-span-2">
                    <span className="font-medium text-slate-900">Ragione sociale:</span>{" "}
                    {selected.companyName}
                  </p>
                ) : null}
              </div>

              <section>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Indirizzo di spedizione (profilo)
                </h3>
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {formatAddress({
                    street: selected.shippingStreet,
                    zip: selected.shippingZip,
                    city: selected.shippingCity,
                    province: selected.shippingProvince,
                  })}
                </p>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Cronologia ordini
                </h3>
                {selected.orders.length === 0 ? (
                  <p className="text-sm text-slate-500">Nessun ordine associato.</p>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-medium">Ordine</th>
                          <th className="px-3 py-2 font-medium">Data</th>
                          <th className="px-3 py-2 font-medium">Stato</th>
                          <th className="px-3 py-2 text-right font-medium">Totale</th>
                          <th className="px-3 py-2 font-medium">Spedizione</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.orders.map((order) => (
                          <tr key={order.id} className="border-t border-slate-100">
                            <td className="px-3 py-2">
                              <Link
                                to={`/admin/orders/${encodeURIComponent(order.id)}`}
                                className="font-medium text-brand-700 hover:underline"
                              >
                                {order.id.slice(0, 8)}…
                              </Link>
                            </td>
                            <td className="px-3 py-2 text-slate-700">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-3 py-2">
                              <Badge variant="default">{order.status}</Badge>
                            </td>
                            <td className="px-3 py-2 text-right font-semibold tabular-nums">
                              {eur.format(order.total)}
                            </td>
                            <td className="max-w-[14rem] px-3 py-2 text-xs text-slate-600">
                              {formatAddress({
                                street: order.shippingStreet,
                                zip: order.shippingZip,
                                city: order.shippingCity,
                                province: order.shippingProvince,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
