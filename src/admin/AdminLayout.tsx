import { NavLink, Outlet } from "react-router-dom";
import { ClipboardList, Package, ReceiptText, Users } from "lucide-react";

import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";
import { logoutAdmin } from "../lib/adminAuth";

const nav = [
  { to: "/admin", label: "Dashboard", icon: ClipboardList },
  { to: "/admin/products", label: "Prodotti", icon: Package },
  { to: "/admin/orders", label: "Ordini", icon: ReceiptText },
  { to: "/admin/customers", label: "Clienti", icon: Users },
] as const;

export function AdminLayout() {
  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Back office
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    Admin
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <nav className="p-2">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
                        isActive &&
                          "bg-slate-900 text-white hover:bg-slate-900",
                      )
                    }
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 pt-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  logoutAdmin();
                  window.location.href = "/admin/login";
                }}
              >
                Logout
              </Button>
            </div>
          </aside>

          <section className="min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

