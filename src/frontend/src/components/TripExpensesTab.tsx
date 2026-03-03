import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Loader2,
  Plus,
  Receipt,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import type { TripPlan } from "../backend.d";
import {
  useAddExpense,
  useDeleteExpense,
  useGetExpenses,
} from "../hooks/useQueries";

const EXPENSE_CATEGORIES = [
  { id: "Food", label: "Food & Dining", emoji: "🍛" },
  { id: "Transport", label: "Transport", emoji: "🚗" },
  { id: "Accommodation", label: "Accommodation", emoji: "🏨" },
  { id: "Sightseeing", label: "Sightseeing", emoji: "📷" },
  { id: "Shopping", label: "Shopping", emoji: "🛍️" },
  { id: "Entertainment", label: "Entertainment", emoji: "🎭" },
  { id: "Misc", label: "Miscellaneous", emoji: "📦" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#e07b39",
  Transport: "#3b82f6",
  Accommodation: "#8b5cf6",
  Sightseeing: "#0d9488",
  Shopping: "#ec4899",
  Entertainment: "#f59e0b",
  Misc: "#6b7280",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TripExpensesTab({ trip }: { trip: TripPlan }) {
  const { data: expenses, isLoading } = useGetExpenses(trip.id);
  const addExpenseMutation = useAddExpense();
  const deleteExpenseMutation = useDeleteExpense();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const totalSpent = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;
  const remaining = trip.totalBudget - totalSpent;
  const percentageUsed = (totalSpent / trip.totalBudget) * 100;
  const isOverBudget = totalSpent > trip.totalBudget;

  // Spending by category for pie chart
  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => ({
    name: cat.label,
    id: cat.id,
    value:
      expenses
        ?.filter((e) => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0) ?? 0,
    color: CATEGORY_COLORS[cat.id],
    emoji: cat.emoji,
  })).filter((c) => c.value > 0);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !category || !amount) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const amountNum = Number.parseFloat(amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      await addExpenseMutation.mutateAsync({
        tripId: trip.id,
        date,
        category,
        amount: amountNum,
        note: note.trim(),
      });
      setAmount("");
      setNote("");
      toast.success("Expense logged successfully!");
    } catch {
      toast.error("Failed to log expense.");
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpenseMutation.mutateAsync({
        id: expenseId,
        tripId: trip.id,
      });
      toast.success("Expense deleted.");
    } catch {
      toast.error("Failed to delete expense.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-card border border-border overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{
              background: isOverBudget
                ? "oklch(0.55 0.22 27)"
                : "linear-gradient(90deg, oklch(0.62 0.18 47), oklch(0.45 0.12 195))",
            }}
          />
          <CardContent className="pt-5 pb-5">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  Total Budget
                </div>
                <div className="font-display font-bold text-foreground text-sm">
                  {formatCurrency(trip.totalBudget)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  Total Spent
                </div>
                <div
                  className={`font-display font-bold text-sm ${isOverBudget ? "text-destructive" : "text-foreground"}`}
                >
                  {formatCurrency(totalSpent)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  Remaining
                </div>
                <div
                  className={`font-display font-bold text-sm ${remaining < 0 ? "text-destructive" : "text-green-600"}`}
                >
                  {remaining < 0 ? "-" : "+"}
                  {formatCurrency(Math.abs(remaining))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Spent</span>
                <span>
                  {Math.min(Math.round(percentageUsed), 999)}% of budget
                </span>
              </div>
              <Progress
                value={Math.min(percentageUsed, 100)}
                className="h-3"
                data-ocid="expenses.loading_state"
              />
            </div>

            {isOverBudget && (
              <Alert
                variant="destructive"
                className="mt-3"
                data-ocid="expenses.error_state"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You've exceeded your budget by{" "}
                  {formatCurrency(totalSpent - trip.totalBudget)}! Consider
                  reviewing your expenses.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Expense Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="font-display flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Log Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="expense-date"
                      className="text-sm mb-1.5 block"
                    >
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="expense-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      data-ocid="expenses.input"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="expense-category"
                      className="text-sm mb-1.5 block"
                    >
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger data-ocid="expenses.select">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <span>{cat.emoji}</span>
                              <span>{cat.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="expense-amount"
                    className="text-sm mb-1.5 block"
                  >
                    Amount (₹) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      min={0.01}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      data-ocid="expenses.amount.input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="expense-note"
                    className="text-sm mb-1.5 block"
                  >
                    Note (optional)
                  </Label>
                  <Textarea
                    id="expense-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a brief description..."
                    rows={2}
                    data-ocid="expenses.textarea"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={
                    addExpenseMutation.isPending || !category || !amount
                  }
                  data-ocid="expenses.submit_button"
                  className="w-full gradient-saffron text-white border-none"
                >
                  {addExpenseMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {addExpenseMutation.isPending ? "Logging..." : "Log Expense"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spending Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card border border-border h-full">
            <CardHeader className="pb-4">
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-accent" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryTotals.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="expenses.empty_state"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-muted-foreground text-sm">
                    No expenses logged yet. Start tracking your spending above!
                  </p>
                </div>
              ) : (
                <div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={categoryTotals}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryTotals.map((entry) => (
                          <Cell key={entry.id} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid oklch(0.88 0.03 70)",
                          background: "oklch(0.99 0.008 80)",
                        }}
                      />
                      <Legend
                        formatter={(value) => (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "oklch(0.5 0.05 50)",
                            }}
                          >
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-1.5">
                    {categoryTotals.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: cat.color }}
                          />
                          <span className="text-muted-foreground">
                            {cat.emoji} {cat.id}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {formatCurrency(cat.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expense List */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-card border border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gold-500" />
                Expense Log
              </CardTitle>
              {expenses && expenses.length > 0 && (
                <Badge variant="secondary">{expenses.length} entries</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div
                className="space-y-3"
                data-ocid="expenses.list.loading_state"
              >
                {(["sk1", "sk2", "sk3"] as const).map((sk) => (
                  <Skeleton key={sk} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : expenses?.length === 0 ? (
              <div
                className="text-center py-10"
                data-ocid="expenses.list.empty_state"
              >
                <div className="text-4xl mb-2">🧾</div>
                <p className="text-muted-foreground text-sm">
                  No expenses logged yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {expenses?.map((expense, index) => {
                    const cat = EXPENSE_CATEGORIES.find(
                      (c) => c.id === expense.category,
                    );
                    return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: index * 0.04 }}
                        data-ocid={`expenses.item.${index + 1}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{
                            background: `${CATEGORY_COLORS[expense.category]}22`,
                          }}
                        >
                          {cat?.emoji ?? "💰"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">
                              {expense.note || cat?.label || expense.category}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs flex-shrink-0"
                              style={{
                                color: CATEGORY_COLORS[expense.category],
                                borderColor: `${CATEGORY_COLORS[expense.category]}44`,
                              }}
                            >
                              {expense.category}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {expense.date}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-display font-semibold text-foreground">
                            {formatCurrency(expense.amount)}
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                              data-ocid={`expenses.delete_button.${index + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-ocid="expenses.dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Expense
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Remove this expense of{" "}
                                {formatCurrency(expense.amount)} from your log?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-ocid="expenses.cancel_button">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteExpense(expense.id)}
                                data-ocid="expenses.confirm_button"
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
