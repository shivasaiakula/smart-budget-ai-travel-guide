import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import TripDetailPage from "./pages/TripDetailPage";
import TripPlannerPage from "./pages/TripPlannerPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
});

function IndexPage() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  if (identity) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const tripPlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plan",
  component: TripPlannerPage,
});

const tripDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trip/$tripId",
  component: TripDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  tripPlannerRoute,
  tripDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
