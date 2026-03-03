import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Expense, TripPlan, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

// ---- Trip Plans ----

export function useGetTripPlans() {
  const { actor, isFetching } = useActor();
  return useQuery<TripPlan[]>({
    queryKey: ["tripPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTripPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTripPlan(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<TripPlan>({
    queryKey: ["tripPlan", id],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTripPlan(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateTripPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      destination,
      numberOfDays,
      numberOfTravelers,
      totalBudget,
      preferences,
    }: {
      destination: string;
      numberOfDays: number;
      numberOfTravelers: number;
      totalBudget: number;
      preferences: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTripPlan(
        destination,
        BigInt(numberOfDays),
        BigInt(numberOfTravelers),
        totalBudget,
        preferences,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripPlans"] });
    },
  });
}

export function useDeleteTripPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTripPlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripPlans"] });
    },
  });
}

// ---- Expenses ----

export function useGetExpenses(tripId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Expense[]>({
    queryKey: ["expenses", tripId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExpenses(tripId);
    },
    enabled: !!actor && !isFetching && !!tripId,
  });
}

export function useAddExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tripId,
      date,
      category,
      amount,
      note,
    }: {
      tripId: string;
      date: string;
      category: string;
      amount: number;
      note: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addExpense(tripId, date, category, amount, note);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
    },
  });
}

export function useDeleteExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; tripId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteExpense(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
    },
  });
}

// ---- User Profile ----

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
