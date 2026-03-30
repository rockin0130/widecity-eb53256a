import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { GCAL_OAUTH_EVENT, parseOAuthReturnUrl } from "@/lib/oauthDeepLink";

const queryClient = new QueryClient();

/** Bridges native OAuth redirect (custom URL scheme) into a window event for Index / Settings. */
function NativeOauthDeepLinkBridge() {
  useEffect(() => {
    let remove: (() => void) | undefined;

    const handleUrl = (url: string) => {
      const { gcal, group } = parseOAuthReturnUrl(url);
      if (gcal === "connected") {
        window.dispatchEvent(
          new CustomEvent(GCAL_OAUTH_EVENT, { detail: { groupId: group || undefined } }),
        );
      }
    };

    void (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { App } = await import("@capacitor/app");
        const sub = await App.addListener("appUrlOpen", ({ url }) => handleUrl(url));
        remove = () => sub.remove();
        const launch = await App.getLaunchUrl();
        if (launch?.url) handleUrl(launch.url);
      } catch {
        /* plugin unavailable (e.g. web dev) */
      }
    })();

    return () => remove?.();
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NativeOauthDeepLinkBridge />
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
