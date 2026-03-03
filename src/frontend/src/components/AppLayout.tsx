import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto h-14 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            data-ocid="nav.link"
          >
            <span className="text-xl">🗺️</span>
            <span className="font-display text-base font-bold text-foreground hidden sm:block">
              Smart Budget <span className="text-primary">AI</span> Guide
            </span>
            <MapPin className="w-4 h-4 text-primary sm:hidden" />
          </button>

          {identity && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/" })}
                data-ocid="nav.dashboard.link"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Button>
              <Button
                size="sm"
                onClick={() => navigate({ to: "/plan" })}
                data-ocid="nav.plan.primary_button"
                className="gradient-saffron text-white border-none"
              >
                + New Trip
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-5 border-t border-border bg-background mt-auto">
        <div className="container mx-auto text-center text-muted-foreground text-sm px-4">
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
