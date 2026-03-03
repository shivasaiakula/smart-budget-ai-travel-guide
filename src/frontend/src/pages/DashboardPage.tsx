import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Loader2,
  LogOut,
  MapPin,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { TripPlan } from "../backend.d";
import AppLayout from "../components/AppLayout";
import { getDestination } from "../data/destinations";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteTripPlan,
  useGetTripPlans,
  useGetUserProfile,
  useSaveUserProfile,
} from "../hooks/useQueries";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function TripCard({
  trip,
  onDelete,
  index,
}: {
  trip: TripPlan;
  onDelete: (id: string) => void;
  index: number;
}) {
  const navigate = useNavigate();
  const destination = getDestination(trip.destination);
  const totalCost =
    trip.transportCost +
    trip.accommodationCost +
    trip.foodCost +
    trip.sightseeingCost +
    trip.miscCost;
  const budgetUsed = Math.min((totalCost / trip.totalBudget) * 100, 100);
  const isOverBudget = totalCost > trip.totalBudget;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      data-ocid={`trips.item.${index + 1}`}
    >
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border overflow-hidden">
        <div
          className="h-2 w-full"
          style={{
            background: isOverBudget
              ? "oklch(0.55 0.22 27)"
              : "linear-gradient(90deg, oklch(0.62 0.18 47), oklch(0.45 0.12 195))",
          }}
        />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{destination?.emoji ?? "📍"}</span>
              <div>
                <CardTitle className="font-display text-lg text-foreground">
                  {trip.destination}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {destination?.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOverBudget && (
                <Badge variant="destructive" className="text-xs">
                  Over Budget
                </Badge>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    data-ocid={`trips.delete_button.${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="trips.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Trip Plan</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the trip to{" "}
                      {trip.destination}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="trips.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(trip.id)}
                      data-ocid="trips.confirm_button"
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">
                {trip.numberOfDays.toString()} days
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-foreground font-medium">
                {trip.numberOfTravelers.toString()} travelers
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-gold-500" />
              <span className="text-foreground font-medium text-xs">
                {formatCurrency(trip.totalBudget)}
              </span>
            </div>
          </div>

          {trip.preferences.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {trip.preferences.slice(0, 3).map((pref) => (
                <Badge
                  key={pref}
                  variant="secondary"
                  className="text-xs capitalize"
                >
                  {pref}
                </Badge>
              ))}
              {trip.preferences.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{trip.preferences.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Planned Cost</span>
              <span
                className={isOverBudget ? "text-destructive font-semibold" : ""}
              >
                {formatCurrency(totalCost)} / {formatCurrency(trip.totalBudget)}
              </span>
            </div>
            <Progress
              value={budgetUsed}
              className="h-2"
              data-ocid={`trips.loading_state.${index + 1}`}
            />
          </div>

          <Button
            className="w-full gradient-saffron text-white border-none"
            onClick={() =>
              navigate({ to: "/trip/$tripId", params: { tripId: trip.id } })
            }
            data-ocid={`trips.primary_button.${index + 1}`}
          >
            View Trip Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();
  const { data: trips, isLoading: tripsLoading } = useGetTripPlans();
  const { data: userProfile } = useGetUserProfile();
  const saveProfileMutation = useSaveUserProfile();
  const deleteTrip = useDeleteTripPlan();

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    if (userProfile === null && identity) {
      setShowNameDialog(true);
    }
  }, [userProfile, identity]);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    await saveProfileMutation.mutateAsync({ name: nameInput.trim() });
    setShowNameDialog(false);
    toast.success("Welcome aboard! Your profile is set.");
  };

  const handleDeleteTrip = async (id: string) => {
    await deleteTrip.mutateAsync(id);
    toast.success("Trip deleted.");
  };

  const displayName =
    userProfile?.name ||
    `${identity?.getPrincipal().toString().slice(0, 10)}...`;

  const totalBudget = trips?.reduce((sum, t) => sum + t.totalBudget, 0) ?? 0;
  const totalTrips = trips?.length ?? 0;

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header Banner */}
        <div className="gradient-hero py-10 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="text-white/70 text-sm mb-1">Welcome back 👋</p>
                <h1 className="font-display text-3xl font-bold text-white">
                  {displayName}
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  {totalTrips === 0
                    ? "Ready to plan your first Indian adventure?"
                    : `${totalTrips} trip${totalTrips > 1 ? "s" : ""} planned`}
                </p>
              </motion.div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNameDialog(true)}
                  className="bg-white/15 text-white border-white/30 hover:bg-white/25"
                  data-ocid="dashboard.edit_button"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="bg-white/15 text-white border-white/30 hover:bg-white/25"
                  data-ocid="dashboard.secondary_button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4 space-y-8">
          {/* Quick Stats */}
          {totalTrips > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              <Card className="shadow-card border border-border">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-foreground">
                        {totalTrips}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Trips
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card border border-border">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-display font-bold text-foreground">
                        {formatCurrency(totalBudget)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Planned
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card border border-border col-span-2 sm:col-span-1">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.72 0.15 85), oklch(0.62 0.18 47))",
                      }}
                    >
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-display font-bold text-foreground">
                        AI
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Powered Plans
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* My Trips Section */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl font-bold text-foreground">
                My Trip Plans
              </h2>
              <Button
                onClick={() => navigate({ to: "/plan" })}
                data-ocid="dashboard.primary_button"
                className="gradient-saffron text-white border-none shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Plan New Trip
              </Button>
            </div>

            {tripsLoading ? (
              <div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="dashboard.loading_state"
              >
                {(["sk1", "sk2", "sk3"] as const).map((sk) => (
                  <Card key={sk} className="shadow-card">
                    <CardContent className="pt-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : trips?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="dashboard.empty_state"
                className="text-center py-20 bg-card rounded-2xl border border-border shadow-card"
              >
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No trips planned yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your first Indian adventure with AI-powered
                  budget planning.
                </p>
                <Button
                  onClick={() => navigate({ to: "/plan" })}
                  data-ocid="dashboard.empty_state.primary_button"
                  className="gradient-saffron text-white border-none shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Plan Your First Trip
                </Button>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {trips?.map((trip, index) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onDelete={handleDeleteTrip}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Name Dialog */}
        <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
          <DialogContent data-ocid="profile.dialog">
            <DialogHeader>
              <DialogTitle className="font-display">
                Welcome! What's your name?
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="name-input">Your Name</Label>
                <Input
                  id="name-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1.5"
                  data-ocid="profile.input"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNameDialog(false)}
                data-ocid="profile.cancel_button"
              >
                Skip
              </Button>
              <Button
                onClick={handleSaveName}
                disabled={saveProfileMutation.isPending || !nameInput.trim()}
                data-ocid="profile.save_button"
                className="gradient-saffron text-white border-none"
              >
                {saveProfileMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Name
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
