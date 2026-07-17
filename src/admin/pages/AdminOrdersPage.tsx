import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchOrdersForAdmin, type AdminOrder } from "../../api/ordersSupabase";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { DataTable } from "../../components/ui/data-table";

const dtf = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "short",
  timeStyle: "short",
});

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

function statusVariant(status: string): "default" | "success" | "warning" | "brand" {
  const s = status.toLowerCase();
  if (s.includes("annull")) return "warning";
  if (s.includes("complet") || s.includes("paid") || s.includes("pagat")) return "success";
  if (s.includes("sped") || s.includes("shipped")) return "brand";
  return "default";
}

function formatDate(input?: string): string {
  if (!input) return "—";
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? "—" : dtf.format(d);
}

export function AdminOrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["admin-orders-table"],
    queryFn: fetchOrdersForAdmin,
    staleTime: 30_000,
  });

  const columns = useMemo<ColumnDef<AdminOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID Ordine",
        cell: ({ row }) => (
          <Link
            to={`/admin/orders/${encodeURIComponent(row.original.id)}`}
            className="font-medium text-brand-700 hover:text-brand-900 hover:underline"
          >
            {row.original.id}
          </Link>
        ),
      },
      {
        id: "customerEmail",
        header: "Cliente (email)",
        cell: ({ row }) => (
          <span className="text-slate-800">
            {row.original.billingEmail?.trim() || row.original.customer}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => (
          <span className="text-slate-700">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        accessorKey: "total",
        header: () => <div className="text-right">Totale</div>,
        cell: ({ row }) => (
          <div className="text-right font-semibold text-slate-900">
            {eur.format(row.original.total)}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>
            {row.original.status || "In Elaborazione"}
          </Badge>
        ),
      },
    ],
    [],
  );

  const orders = ordersQuery.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Ordini</h1>
        <p className="mt-1 text-sm text-slate-600">
          Gestione ordini da Supabase (`orders`) con tabella amministrativa.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Elenco ordini</CardTitle>
          <CardDescription>
            {ordersQuery.isPending ? "Caricamento…" : `${orders.length} ordini`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={orders} />
          {ordersQuery.isError ? (
            <p className="mt-3 text-sm font-medium text-red-700" role="alert">
              {(ordersQuery.error as Error)?.message ?? "Errore nel caricamento ordini"}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

