import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Sparkles,
  Tag,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import { DESTINATIONS, getDestination } from "../data/destinations";
import { useCreateTripPlan } from "../hooks/useQueries";

const PREFERENCES = [
  { id: "adventure", label: "Adventure", emoji: "🧗" },
  { id: "spiritual", label: "Spiritual", emoji: "🕌" },
  { id: "historical", label: "Historical", emoji: "🏛️" },
  { id: "beach", label: "Beach", emoji: "🏖️" },
  { id: "hill_station", label: "Hill Station", emoji: "⛰️" },
  { id: "cultural", label: "Cultural", emoji: "🎭" },
  { id: "food", label: "Food & Cuisine", emoji: "🍛" },
];

export default function TripPlannerPage() {
  const navigate = useNavigate();
  const createTripMutation = useCreateTripPlan();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState<string>("5");
  const [travelers, setTravelers] = useState<string>("2");
  const [budget, setBudget] = useState<string>("50000");
  const [preferences, setPreferences] = useState<string[]>([]);

  const selectedDestination = destination ? getDestination(destination) : null;

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination) {
      toast.error("Please select a destination.");
      return;
    }
    const daysNum = Number.parseInt(days);
    const travelersNum = Number.parseInt(travelers);
    const budgetNum = Number.parseInt(budget);

    if (!daysNum || daysNum < 1 || daysNum > 30) {
      toast.error("Days must be between 1 and 30.");
      return;
    }
    if (!travelersNum || travelersNum < 1 || travelersNum > 20) {
      toast.error("Travelers must be between 1 and 20.");
      return;
    }
    if (!budgetNum || budgetNum < 1000) {
      toast.error("Budget must be at least ₹1,000.");
      return;
    }

    try {
      const trip = await createTripMutation.mutateAsync({
        destination,
        numberOfDays: daysNum,
        numberOfTravelers: travelersNum,
        totalBudget: budgetNum,
        preferences,
      });
      toast.success("AI trip plan generated successfully! 🎉");
      navigate({ to: "/trip/$tripId", params: { tripId: trip.id } });
    } catch {
      toast.error("Failed to generate trip plan. Please try again.");
    }
  };

  const estimatedBudgetPerDay =
    budget && days
      ? Math.round(
          Number.parseInt(budget) /
            Number.parseInt(days) /
            Number.parseInt(travelers || "1"),
        )
      : 0;

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
              data-ocid="planner.secondary_button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">
                  Plan New Trip
                </h1>
                <p className="text-white/70 text-sm">
                  AI will generate a custom budget & itinerary
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Choose Destination
                  </CardTitle>
                  <CardDescription>
                    Select from 20 iconic Indian destinations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger
                      className="w-full"
                      data-ocid="planner.select"
                    >
                      <SelectValue placeholder="Select a destination..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DESTINATIONS.map((dest) => (
                        <SelectItem key={dest.name} value={dest.name}>
                          <div className="flex items-center gap-2">
                            <span>{dest.emoji}</span>
                            <span>{dest.name}</span>
                            <span className="text-muted-foreground text-xs">
                              ({dest.state})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedDestination && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">
                          {selectedDestination.emoji}
                        </span>
                        <div>
                          <div className="font-medium text-foreground">
                            {selectedDestination.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {selectedDestination.state}
                          </div>
                          <Badge
                            variant="outline"
                            className="mt-1.5 text-xs capitalize"
                          >
                            {selectedDestination.type.replace("_", " ")}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">
                            🌟 Best season:{" "}
                            <strong>{selectedDestination.bestSeason}</strong>
                          </p>
                          <p className="text-xs text-primary mt-1">
                            💡 {selectedDestination.tip}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Trip Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="days"
                        className="flex items-center gap-1.5 mb-2"
                      >
                        <Calendar className="w-4 h-4 text-primary" />
                        Number of Days
                      </Label>
                      <Input
                        id="days"
                        type="number"
                        min={1}
                        max={30}
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        data-ocid="planner.input"
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        1-30 days
                      </p>
                    </div>
                    <div>
                      <Label
                        htmlFor="travelers"
                        className="flex items-center gap-1.5 mb-2"
                      >
                        <Users className="w-4 h-4 text-accent" />
                        Number of Travelers
                      </Label>
                      <Input
                        id="travelers"
                        type="number"
                        min={1}
                        max={20}
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        data-ocid="planner.travelers.input"
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        1-20 people
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="budget"
                      className="flex items-center gap-1.5 mb-2"
                    >
                      <Wallet className="w-4 h-4 text-gold-500" />
                      Total Budget (INR)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        ₹
                      </span>
                      <Input
                        id="budget"
                        type="number"
                        min={1000}
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        data-ocid="planner.budget.input"
                        className="pl-8"
                        placeholder="50000"
                      />
                    </div>
                    {estimatedBudgetPerDay > 0 && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        ≈ ₹{estimatedBudgetPerDay.toLocaleString("en-IN")}
                        /person/day
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gold-500" />
                    Travel Preferences
                  </CardTitle>
                  <CardDescription>
                    Select what matters most to you (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PREFERENCES.map((pref) => {
                      const isSelected = preferences.includes(pref.id);
                      return (
                        <label
                          key={pref.id}
                          htmlFor={`pref-${pref.id}`}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:border-primary/50 hover:bg-secondary/50"
                          }`}
                          data-ocid="planner.checkbox"
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => togglePreference(pref.id)}
                            id={`pref-${pref.id}`}
                          />
                          <span className="text-lg">{pref.emoji}</span>
                          <span className="text-sm font-medium text-foreground">
                            {pref.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {preferences.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {preferences.map((pref) => {
                        const p = PREFERENCES.find((p) => p.id === pref);
                        return (
                          <Badge
                            key={pref}
                            className="bg-primary/15 text-primary border-primary/25 text-xs"
                          >
                            {p?.emoji} {p?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={createTripMutation.isPending || !destination}
                data-ocid="planner.submit_button"
                className="w-full gradient-saffron text-white border-none text-base py-6 shadow-glow hover:shadow-lg transition-all"
              >
                {createTripMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating AI Trip Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Trip Plan
                  </>
                )}
              </Button>
              {createTripMutation.isPending && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Our AI is crafting your perfect itinerary and budget
                  breakdown...
                </p>
              )}
            </motion.div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
