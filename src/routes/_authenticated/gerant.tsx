import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus, listAdminData, ORDER_STATUSES, updateOrderStatus } from "@/lib/admin.functions";
import { formatFcfa } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/gerant")({
  head: () => ({
    meta: [
      { title: "Espace gérant — Maison Karité" },
      { name: "description", content: "Suivi des commandes et des messages." },
      { property: "og:title", content: "Espace gérant — Maison Karité" },
      { property: "og:description", content: "Suivi des commandes et des messages." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GerantPage,
});

type Line = { name: string; size: string; quantity: number };

function GerantPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const statusFn = useServerFn(getAdminStatus);
  const dataFn = useServerFn(listAdminData);
  const updateFn = useServerFn(updateOrderStatus);
  const [tab, setTab] = useState<"orders" | "requests">("orders");

  const status = useQuery(queryOptions({ queryKey: ["admin-status"], queryFn: () => statusFn() }));
  const data = useQuery({
    queryKey: ["admin-data"],
    queryFn: () => dataFn(),
    enabled: status.data?.isAdmin === true,
  });

  async function logout() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/" });
  }

  async function changeStatus(id: string, s: (typeof ORDER_STATUSES)[number]) {
    try {
      await updateFn({ data: { id, status: s } });
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["admin-data"] });
    } catch {
      toast.error("Mise à jour impossible");
    }
  }

  if (status.isLoading) return <Loading />;
  if (!status.data?.isAdmin) {
    return (
      <div className="container-page max-w-lg py-20 text-center">
        <h1 className="text-3xl font-semibold">Accès non autorisé</h1>
        <p className="mt-3 text-muted-foreground">
          Le compte {status.data?.email ?? ""} n'a pas encore le rôle de gérant.
        </p>
        <Button variant="outline" className="mt-6" onClick={logout}><LogOut aria-hidden /> Se déconnecter</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Espace gérant</p>
          <h1 className="mt-1 text-3xl font-semibold">Tableau de bord</h1>
        </div>
        <Button variant="outline" onClick={logout}><LogOut aria-hidden /> Se déconnecter</Button>
      </div>

      <div className="mt-8 inline-flex rounded-md border border-border bg-muted p-1">
        {(["orders", "requests"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={tab === t ? "rounded bg-card px-4 py-2 text-sm font-semibold text-primary shadow-soft" : "rounded px-4 py-2 text-sm text-muted-foreground"}
          >
            {t === "orders" ? `Commandes (${data.data?.orders.length ?? 0})` : `Messages & devis (${data.data?.requests.length ?? 0})`}
          </button>
        ))}
      </div>

      {data.isLoading ? (
        <Loading />
      ) : data.isError ? (
        <p className="mt-8 text-destructive">Impossible de charger les données.</p>
      ) : tab === "orders" ? (
        <div className="mt-6 space-y-4">
          {data.data?.orders.length === 0 && <p className="text-muted-foreground">Aucune commande pour le moment.</p>}
          {data.data?.orders.map((o) => (
            <article key={o.id} className="rounded-lg border border-border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{o.reference} · {o.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("fr-FR")} · {o.commune} — {o.address}
                  </p>
                </div>
                <select
                  aria-label="Statut"
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value as (typeof ORDER_STATUSES)[number])}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <ul className="mt-3 text-sm">
                {(o.items as Line[]).map((l, i) => <li key={i}>{l.quantity} × {l.name} ({l.size})</li>)}
              </ul>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1.5 text-primary"><Phone className="size-4" aria-hidden />{o.phone}</a>
                <span className="font-semibold">{formatFcfa(o.total_fcfa)}</span>
              </div>
              {o.notes && <p className="mt-2 text-sm text-muted-foreground">Remarque : {o.notes}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {data.data?.requests.length === 0 && <p className="text-muted-foreground">Aucun message pour le moment.</p>}
          {data.data?.requests.map((r) => (
            <article key={r.id} className="rounded-lg border border-border bg-card p-5 shadow-soft">
              <p className="font-semibold">
                {r.request_type === "devis" ? "Devis" : "Question"} · {r.name}
                {r.company ? ` (${r.company})` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(r.created_at).toLocaleString("fr-FR")} · <a href={`tel:${r.phone}`} className="text-primary">{r.phone}</a>
                {r.email ? ` · ${r.email}` : ""}
                {r.quantity ? ` · Quantité : ${r.quantity}` : ""}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm">{r.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Loading() {
  return <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;
}
