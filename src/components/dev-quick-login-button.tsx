"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEV_EMAIL = "john.doe@example.com";
const DEV_PASSWORD = "testtest";

export function DevQuickLoginButton() {
  const router = useRouter();
  const [pending, setPending] = useState<
    null | "login" | "reset" | "applyPassword"
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [resetInfo, setResetInfo] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState("");

  async function handleLogin() {
    setPending("login");
    setError(null);
    setResetInfo(null);
    const { error: signInError } = await authClient.signIn.email({
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
    });
    setPending(null);
    if (signInError) {
      setError(signInError.message ?? "Connexion impossible");
      return;
    }
    router.refresh();
  }

  async function handlePasswordReset() {
    setPending("reset");
    setError(null);
    setResetInfo(null);
    const { error: resetError } = await authClient.requestPasswordReset({
      email: DEV_EMAIL,
    });
    setPending(null);
    if (resetError) {
      setError(resetError.message ?? "Demande de réinitialisation impossible");
      return;
    }
    setResetInfo("Demande de réinitialisation envoyée.");
  }

  async function handleApplyPasswordFromToken() {
    const token = resetToken.trim();
    if (!token) {
      setError("Collez le token de réinitialisation.");
      return;
    }
    setPending("applyPassword");
    setError(null);
    setResetInfo(null);
    const { error: applyError } = await authClient.resetPassword({
      token,
      newPassword: DEV_PASSWORD,
    });
    setPending(null);
    if (applyError) {
      setError(applyError.message ?? "Impossible d’appliquer le nouveau mot de passe");
      return;
    }
    setResetToken("");
    setResetInfo("Mot de passe mis à jour (constante dev). Tu peux te connecter.");
  }

  const busy = pending !== null;

  return (
    <div className="flex w-full max-w-sm flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={handleLogin}
        >
          {pending === "login" ? "Connexion…" : "Se connecter (dev)"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={handlePasswordReset}
        >
          {pending === "reset" ? "Envoi…" : "Reset mot de passe (dev)"}
        </Button>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="sr-only" htmlFor="dev-reset-token">
          Token de réinitialisation
        </label>
        <Input
          id="dev-reset-token"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Token (ex. sU6xS6H9kJpMdsrfqfQ3lrIY)"
          value={resetToken}
          disabled={busy}
          onChange={(e) => setResetToken(e.target.value)}
          className="font-mono text-xs"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={busy}
          onClick={handleApplyPasswordFromToken}
        >
          {pending === "applyPassword"
            ? "Application…"
            : "Appliquer le mot de passe (token + constante)"}
        </Button>
      </div>
      {error ? (
        <p className="max-w-xs text-right text-xs text-destructive">{error}</p>
      ) : null}
      {resetInfo ? (
        <p className="max-w-xs text-right text-xs text-muted-foreground">
          {resetInfo}
        </p>
      ) : null}
    </div>
  );
}
