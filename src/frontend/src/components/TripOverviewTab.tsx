import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Bus,
  Camera,
  CloudRain,
  Hotel,
  MapPin,
  MoreHorizontal,
  Snowflake,
  Sun,
  Tag,
  ThumbsUp,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import type { TripPlan } from "../backend.d";
import { getCurrentSeason, getDestination } from "../data/destinations";

interface CostBreakdownItem {
  label: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TripOverviewTab({ trip }: { trip: TripPlan }) {
  const destination = getDestination(trip.destination);
  const currentSeason = getCurrentSeason();

  const totalCost =
    trip.transportCost +
    trip.accommodationCost +
    trip.foodCost +
    trip.sightseeingCost +
    trip.miscCost;

  const budgetUsed = totalCost > 0 ? (totalCost / trip.totalBudget) * 100 : 0;
  const isOverBudget = totalCost > trip.totalBudget;
  const remaining = trip.totalBudget - totalCost;

  const costBreakdown: CostBreakdownItem[] = [
    {
      label: "Transport",
      amount: trip.transportCost,
      icon: Bus,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-100",
    },
    {
      label: "Accommodation",
      amount: trip.accommodationCost,
      icon: Hotel,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-100",
    },
    {
      label: "Food",
      amount: trip.foodCost,
      icon: UtensilsCrossed,
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-100",
    },
    {
      label: "Sightseeing",
      amount: trip.sightseeingCost,
      icon: Camera,
      color: "text-teal-600",
      bgColor: "bg-teal-50 border-teal-100",
    },
    {
      label: "Miscellaneous",
      amount: trip.miscCost,
      icon: MoreHorizontal,
      color: "text-gray-600",
      bgColor: "bg-gray-50 border-gray-100",
    },
  ];

  const weatherData = destination?.weather[currentSeason];

  const seasonInfo = {
    summer: {
      icon: Sun,
      label: "Summer",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    monsoon: {
      icon: CloudRain,
      label: "Monsoon",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    winter: {
      icon: Snowflake,
      label: "Winter",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
  };

  const currentSeasonInfo = seasonInfo[currentSeason];

  return (
    <div className="space-y-6">
      {/* Budget Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-card border border-border overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{
              background: isOverBudget
                ? "oklch(0.55 0.22 27)"
                : `linear-gradient(90deg, oklch(0.62 0.18 47) ${Math.min(budgetUsed, 100)}%, oklch(0.88 0.03 70) ${Math.min(budgetUsed, 100)}%)`,
            }}
          />
          <CardHeader className="pb-3">
            <CardTitle className="font-display">Budget Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  Total Budget
                </div>
                <div className="font-display font-bold text-foreground">
                  {formatCurrency(trip.totalBudget)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  Planned Cost
                </div>
                <div
                  className={`font-display font-bold ${isOverBudget ? "text-destructive" : "text-foreground"}`}
                >
                  {formatCurrency(totalCost)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  Remaining
                </div>
                <div
                  className={`font-display font-bold ${remaining < 0 ? "text-destructive" : "text-green-600"}`}
                >
                  {remaining < 0 ? "-" : "+"}
                  {formatCurrency(Math.abs(remaining))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">
                  Budget utilization
                </span>
                <span
                  className={`font-medium ${isOverBudget ? "text-destructive" : "text-foreground"}`}
                >
                  {Math.min(Math.round(budgetUsed), 999)}%
                </span>
              </div>
              <Progress value={Math.min(budgetUsed, 100)} className="h-3" />
              {isOverBudget && (
                <p className="text-destructive text-xs mt-1.5">
                  ⚠️ Planned cost exceeds budget by{" "}
                  {formatCurrency(totalCost - trip.totalBudget)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">
          Cost Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {costBreakdown.map((item, i) => {
            const percentage =
              totalCost > 0 ? Math.round((item.amount / totalCost) * 100) : 0;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <Card
                  className={`shadow-card border ${item.bgColor} text-center`}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 bg-white">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="font-display font-bold text-foreground text-sm">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.label}
                    </div>
                    <Badge variant="outline" className="mt-1.5 text-xs">
                      {percentage}%
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Trip Info + Weather */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trip Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-card border border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Destination Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {destination ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{destination.emoji}</span>
                    <div>
                      <div className="font-display font-semibold text-foreground">
                        {destination.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {destination.state}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-foreground mb-2">
                      Highlights
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {destination.highlights.map((h) => (
                        <Badge key={h} variant="secondary" className="text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      Best Season
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {destination.bestSeason}
                    </div>
                  </div>

                  {trip.preferences.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                        <Tag className="w-4 h-4" />
                        Your Preferences
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trip.preferences.map((pref) => (
                          <Badge
                            key={pref}
                            className="bg-primary/15 text-primary border-primary/25 text-xs capitalize"
                          >
                            {pref.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">{trip.destination}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weather / Season Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-card border border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2">
                <currentSeasonInfo.icon
                  className={`w-5 h-5 ${currentSeasonInfo.color}`}
                />
                Weather & Season Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {destination ? (
                <>
                  <div
                    className={`p-4 rounded-xl border ${currentSeasonInfo.bgColor} flex items-start gap-3`}
                  >
                    <currentSeasonInfo.icon
                      className={`w-6 h-6 ${currentSeasonInfo.color} flex-shrink-0 mt-0.5`}
                    />
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Current Season: {currentSeasonInfo.label}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {weatherData}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(["summer", "monsoon", "winter"] as const).map(
                      (season) => {
                        const info = seasonInfo[season];
                        const isCurrent = season === currentSeason;
                        return (
                          <div
                            key={season}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                              isCurrent
                                ? "border-primary/30 bg-primary/5"
                                : "border-border bg-background"
                            }`}
                          >
                            <info.icon
                              className={`w-4 h-4 ${info.color} flex-shrink-0 mt-0.5`}
                            />
                            <div>
                              <span className="text-sm font-medium text-foreground">
                                {info.label}
                                {isCurrent && (
                                  <Badge className="ml-2 text-xs bg-primary/15 text-primary border-primary/25">
                                    Now
                                  </Badge>
                                )}
                              </span>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {destination.weather[season]}
                              </p>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                    <ThumbsUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{destination.tip}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No weather data available.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
