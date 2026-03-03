import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TripPlan {
    id: string;
    destination: string;
    accommodationCost: number;
    createdAt: bigint;
    numberOfDays: bigint;
    preferences: Array<string>;
    numberOfTravelers: bigint;
    miscCost: number;
    totalBudget: number;
    sightseeingCost: number;
    transportCost: number;
    itinerary: Array<string>;
    foodCost: number;
}
export interface Expense {
    id: string;
    date: string;
    note: string;
    tripId: string;
    category: string;
    amount: number;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExpense(tripId: string, date: string, category: string, amount: number, note: string): Promise<Expense>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTripPlan(destination: string, numberOfDays: bigint, numberOfTravelers: bigint, totalBudget: number, preferences: Array<string>): Promise<TripPlan>;
    deleteExpense(id: string): Promise<boolean>;
    deleteTripPlan(id: string): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExpenses(tripId: string): Promise<Array<Expense>>;
    getTripPlan(id: string): Promise<TripPlan>;
    getTripPlans(): Promise<Array<TripPlan>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
