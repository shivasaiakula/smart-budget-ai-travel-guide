import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Sun } from "lucide-react";
import { motion } from "motion/react";
import type { TripPlan } from "../backend.d";

export default function TripItineraryTab({ trip }: { trip: TripPlan }) {
  const itinerary = trip.itinerary ?? [];

  if (itinerary.length === 0) {
    return (
      <div
        className="text-center py-16 bg-card rounded-2xl border border-border"
        data-ocid="itinerary.empty_state"
      >
        <div className="text-5xl mb-3">📅</div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No itinerary yet
        </h3>
        <p className="text-muted-foreground">
          The AI-generated itinerary will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-xl font-semibold text-foreground">
          {trip.numberOfDays.toString()}-Day Itinerary
        </h2>
        <Badge className="bg-primary/15 text-primary border-primary/25 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          {trip.destination}
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20 hidden sm:block" />

        <div className="space-y-4">
          {itinerary.map((dayText, index) => {
            // Parse "Day X: ..." format
            const dayMatch = dayText.match(/^Day\s*(\d+):?\s*(.*)/i);
            const dayNum = dayMatch ? dayMatch[1] : String(index + 1);
            const activities = dayMatch ? dayMatch[2] : dayText;

            // Split activities by comma or semicolon for better display
            const activityList = activities
              .split(/[,;]/)
              .map((a) => a.trim())
              .filter(Boolean);

            return (
              <motion.div
                key={`day-${dayNum}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                data-ocid={`itinerary.item.${index + 1}`}
                className="sm:pl-14 relative"
              >
                {/* Day circle on timeline */}
                <div className="hidden sm:flex absolute left-0 top-4 w-10 h-10 rounded-full gradient-saffron items-center justify-center text-white font-bold text-sm shadow-md z-10">
                  {dayNum}
                </div>

                <Card className="shadow-card border border-border hover:shadow-card-hover transition-all duration-300">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full gradient-saffron text-white text-xs font-bold">
                        {dayNum}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-gold-500" />
                        <span className="font-display font-semibold text-foreground">
                          Day {dayNum}
                        </span>
                      </div>
                    </div>

                    {activityList.length > 1 ? (
                      <ul className="space-y-2">
                        {activityList.map((activity) => (
                          <li key={activity} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-foreground leading-relaxed">
                              {activity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground leading-relaxed">
                          {activities}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trip Summary Footer */}
      <Card className="mt-6 shadow-card border border-border bg-secondary/30">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                Total:{" "}
                <strong className="text-foreground">
                  {itinerary.length} days
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">
                Destination:{" "}
                <strong className="text-foreground">{trip.destination}</strong>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
