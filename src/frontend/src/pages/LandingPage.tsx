import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  CloudSun,
  Loader2,
  MapPin,
  Star,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: Wallet,
    title: "Smart Budget Planner",
    desc: "AI-powered cost breakdown across transport, accommodation, food, sightseeing and more.",
    color: "from-saffron-400 to-saffron-600",
    delay: 0.1,
  },
  {
    icon: Calendar,
    title: "AI Itinerary Generator",
    desc: "Day-by-day optimized travel plans tailored to your preferences and budget.",
    color: "from-teal-400 to-teal-600",
    delay: 0.2,
  },
  {
    icon: BarChart3,
    title: "Expense Tracker",
    desc: "Log daily expenses, monitor your spending and get instant overspending alerts.",
    color: "from-gold-500 to-gold-600",
    delay: 0.3,
  },
  {
    icon: CloudSun,
    title: "Weather & Season Guide",
    desc: "Know the best time to visit every destination with weather and seasonal insights.",
    color: "from-saffron-300 to-teal-500",
    delay: 0.4,
  },
];

const DESTINATIONS_PREVIEW = [
  { name: "Jaipur", type: "Historical", emoji: "🏯" },
  { name: "Goa", type: "Beach", emoji: "🏖️" },
  { name: "Varanasi", type: "Spiritual", emoji: "🪔" },
  { name: "Manali", type: "Hill Station", emoji: "🏔️" },
  { name: "Kerala", type: "Cultural", emoji: "🌴" },
  { name: "Leh-Ladakh", type: "Adventure", emoji: "⛰️" },
];

const STATS = [
  { value: "20+", label: "Destinations" },
  { value: "AI", label: "Powered" },
  { value: "₹", label: "INR Budget" },
  { value: "100%", label: "Free" },
];

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <span className="font-display text-lg font-bold text-foreground">
              Smart Budget <span className="text-primary">AI</span> Guide
            </span>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="nav.primary_button"
            className="gradient-saffron text-white border-none shadow-md hover:shadow-glow transition-shadow"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/india-hero.dim_1200x600.jpg')",
          }}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, oklch(0.62 0.18 47) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, oklch(0.45 0.12 195) 0%, transparent 50%)`,
          }}
        />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            role="presentation"
          >
            <pattern
              id="pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="2" fill="white" />
              <path
                d="M30 10 L50 30 L30 50 L10 30 Z"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="mb-6 bg-white/15 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm">
                🇮🇳 Made for Indian Travelers
              </Badge>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                Plan Your Perfect{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.78 0.15 85) 0%, oklch(0.72 0.18 55) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Indian
                </span>{" "}
                Getaway
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-xl leading-relaxed font-sans">
                AI-powered trip planning with smart budgeting, personalized
                itineraries, and real-time expense tracking for 20+ incredible
                Indian destinations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="hero.primary_button"
                  className="gradient-saffron text-white border-none text-lg px-8 py-6 shadow-glow hover:shadow-lg transition-all"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5 mr-2" />
                  )}
                  Start Planning Free
                </Button>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-16 grid grid-cols-4 gap-6 max-w-md"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Floating destination cards */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-3"
        >
          {DESTINATIONS_PREVIEW.map((dest, i) => (
            <motion.div
              key={dest.name}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl px-5 py-3 flex items-center gap-3"
            >
              <span className="text-2xl">{dest.emoji}</span>
              <div>
                <div className="text-white font-medium text-sm">
                  {dest.name}
                </div>
                <div className="text-white/60 text-xs">{dest.type}</div>
              </div>
              <MapPin className="w-4 h-4 text-white/40 ml-2" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background mandala-bg">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Everything you need
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Smart Tools for Smart Travelers
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From planning to tracking, we've got your entire Indian travel
              journey covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Preview */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              20 Iconic Indian Destinations
            </h2>
            <p className="text-muted-foreground text-lg">
              From Himalayan peaks to tropical beaches, plan it all in one
              place.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DESTINATIONS_PREVIEW.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-card rounded-xl p-4 text-center shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border cursor-pointer"
              >
                <div className="text-4xl mb-2">{dest.emoji}</div>
                <div className="font-medium text-sm text-foreground">
                  {dest.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {dest.type}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="destinations.primary_button"
              className="gradient-saffron text-white border-none shadow-md hover:shadow-glow"
            >
              {isLoggingIn && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Explore All Destinations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonial / CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-teal opacity-95" />
        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              {(["s1", "s2", "s3", "s4", "s5"] as const).map((s) => (
                <Star key={s} className="w-6 h-6 text-gold-400 fill-gold-400" />
              ))}
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Your Perfect Indian Journey Starts Here
            </h2>
            <p className="text-white/80 text-lg mb-10">
              Join thousands of smart travelers who plan within budget and
              explore India without stress.
            </p>
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="cta.primary_button"
              className="bg-white text-foreground hover:bg-white/90 text-lg px-10 py-6 shadow-lg font-semibold"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : null}
              Start Planning for Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
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
