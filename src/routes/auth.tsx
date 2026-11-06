import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion gérant — Maison Karité" },
      { name: "description", content: "Espace réservé à la gestion des commandes." },
      { property: "og:title", content: "Connexion gérant — Maison Karité" },
      { property: "og:description", content: "Espace réservé à la gestion des commandes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
    });
    setLoading(false);
    if (error) {
      setError("E-mail ou mot de passe incorrect.");
      return;
    }
    navigate({ to: "/gerant" });
  }

  return (
    <div className="container-page flex justify-center py-20">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-lg border border-border bg-card p-8 shadow-soft">
        <div className="text-center">
          <Lock className="mx-auto size-8 text-primary" aria-hidden />
          <h1 className="mt-3 text-2xl font-semibold">Espace gérant</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connectez-vous pour gérer les commandes.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="animate-spin" aria-hidden />} Se connecter
        </Button>
      </form>
    </div>
  );
}
