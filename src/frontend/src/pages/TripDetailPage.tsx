import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import { motion } from "motion/react";
import AppLayout from "../components/AppLayout";
import TripExpensesTab from "../components/TripExpensesTab";
import TripItineraryTab from "../components/TripItineraryTab";
import TripOverviewTab from "../components/TripOverviewTab";
import { useGetTripPlan } from "../hooks/useQueries";

export default function TripDetailPage() {
  const { tripId } = useParams({ from: "/trip/$tripId" });
  const navigate = useNavigate();
  const { data: trip, isLoading } = useGetTripPlan(tripId);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background">
          <div
            className="gradient-hero py-8 px-4"
            data-ocid="trip.loading_state"
          >
            <div className="container mx-auto space-y-3">
              <Skeleton className="h-8 w-48 bg-white/20" />
              <Skeleton className="h-10 w-64 bg-white/20" />
            </div>
          </div>
          <div className="container mx-auto py-8 px-4 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(["s1", "s2", "s3", "s4"] as const).map((s) => (
                <Skeleton key={s} className="h-28 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!trip) {
    return (
      <AppLayout>
        <div
          className="min-h-screen bg-background flex items-center justify-center"
          data-ocid="trip.error_state"
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">😕</div>
            <h2 className="font-display text-2xl font-bold">Trip not found</h2>
            <p className="text-muted-foreground">
              This trip plan doesn't exist or has been deleted.
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              data-ocid="trip.primary_button"
              className="gradient-saffron text-white border-none"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="gradient-hero py-8 px-4">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/15 mb-4 -ml-2"
              onClick={() => navigate({ to: "/" })}
              data-ocid="trip.secondary_button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div>
                <p className="text-white/60 text-sm">Trip Plan</p>
                <h1 className="font-display text-3xl font-bold text-white">
                  {trip.destination}
                </h1>
                <p className="text-white/70 text-sm mt-1">
                  {trip.numberOfDays.toString()} days •{" "}
                  {trip.numberOfTravelers.toString()} traveler
                  {Number(trip.numberOfTravelers) > 1 ? "s" : ""} •{" "}
                  <span className="text-gold-400 font-medium">
                    ₹{trip.totalBudget.toLocaleString("en-IN")} budget
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto py-6 px-4">
          <Tabs defaultValue="overview">
            <TabsList className="w-full sm:w-auto mb-6 bg-secondary border border-border">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-primary"
                data-ocid="trip.overview.tab"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-primary"
                data-ocid="trip.itinerary.tab"
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Itinerary</span>
              </TabsTrigger>
              <TabsTrigger
                value="expenses"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-primary"
                data-ocid="trip.expenses.tab"
              >
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <TripOverviewTab trip={trip} />
            </TabsContent>
            <TabsContent value="itinerary">
              <TripItineraryTab trip={trip} />
            </TabsContent>
            <TabsContent value="expenses">
              <TripExpensesTab trip={trip} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
