import { notFound } from "next/navigation";
import { OAuthCallbackClient } from "./OAuthCallbackClient";
import type { OAuthProvider } from "@/types/auth";

type OAuthCallbackPageProps = {
  params: Promise<{
    provider: string;
  }>;
  searchParams: Promise<{
    code?: string;
    state?: string;
    error?: string;
    error_description?: string;
  }>;
};

export default async function OAuthCallbackPage({ params, searchParams }: OAuthCallbackPageProps) {
  const { provider } = await params;
  const { code, state, error, error_description: errorDescription } = await searchParams;

  if (provider !== "google") {
    notFound();
  }

  return (
    <OAuthCallbackClient
      code={code}
      error={error}
      errorDescription={errorDescription}
      provider={provider as OAuthProvider}
      state={state}
    />
  );
}
