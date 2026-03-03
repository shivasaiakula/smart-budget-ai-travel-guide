import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Run time conversion factors
  let rupeesToDollars = 0.012;
  let costPercentageTransport = 25.0;
  let costPercentageAccommodation = 35.0;
  let costPercentageFood = 20.0;
  let costPercentageSightseeing = 15.0;
  let costPercentageMisc = 5.0;
  let timeConversionFactor = 1000 * 1000; // nanoseconds to milliseconds

  public type TripPlan = {
    id : Text;
    destination : Text;
    numberOfDays : Nat;
    numberOfTravelers : Nat;
    totalBudget : Float;
    preferences : [Text];
    transportCost : Float;
    accommodationCost : Float;
    foodCost : Float;
    sightseeingCost : Float;
    miscCost : Float;
    itinerary : [Text];
    createdAt : Int;
  };

  public type Expense = {
    id : Text;
    tripId : Text;
    date : Text;
    category : Text;
    amount : Float;
    note : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  module TripPlan {
    public func compareByCreatedAt(a : TripPlan, b : TripPlan) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  module Expense {
    public func compareByAmount(a : Expense, b : Expense) : Order.Order {
      Float.compare(b.amount, a.amount);
    };
  };

  let tripPlans = Map.empty<Principal, Map.Map<Text, TripPlan>>();
  let expenses = Map.empty<Principal, Map.Map<Text, Expense>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper function to generate unique IDs
  var counter = 0;
  func generateId() : Text {
    counter += 1;
    let timestamp = (Time.now() / timeConversionFactor).toText();
    timestamp # counter.toText();
  };

  //#region User Profile Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //#endregion

  //#region Trip Plan Functions

  public shared ({ caller }) func createTripPlan(
    destination : Text,
    numberOfDays : Nat,
    numberOfTravelers : Nat,
    totalBudget : Float,
    preferences : [Text]
  ) : async TripPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create trip plans");
    };

    if (numberOfDays == 0 or numberOfTravelers == 0 or totalBudget <= 0) {
      Runtime.trap("Invalid input parameters");
    };

    let rupeeBudget = totalBudget / rupeesToDollars;

    let buildingId = generateId();

    let transportCost = (rupeeBudget * costPercentageTransport) / 100.0;
    let accommodationCost = (rupeeBudget * costPercentageAccommodation) / 100.0;
    let foodCost = (rupeeBudget * costPercentageFood) / 100.0;
    let sightseeingCost = (rupeeBudget * costPercentageSightseeing) / 100.0;
    let miscCost = (rupeeBudget * costPercentageMisc) / 100.0;

    let itinerary = List.empty<Text>();

    let day1 = "Day 1: Arrive in " # destination # ", check into hotel, explore local markets";
    itinerary.add(day1);

    let day2 = "Day 2: Visit popular attractions and try local cuisine";
    itinerary.add(day2);

    if (numberOfDays > 2) {
      let remainingDays = numberOfDays - 2;
      for (day in Nat.range(0, remainingDays)) {
        let dayText = "Day " # (day + 3).toText() # ": Leisure activities and sightseeing";
        itinerary.add(dayText);
      };
    };

    let tripPlan : TripPlan = {
      id = buildingId;
      destination;
      numberOfDays;
      numberOfTravelers;
      totalBudget = rupeeBudget;
      preferences;
      transportCost;
      accommodationCost;
      foodCost;
      sightseeingCost;
      miscCost;
      itinerary = itinerary.toArray();
      createdAt = Time.now() / timeConversionFactor;
    };

    // Store trip plan
    let userTripPlans = switch (tripPlans.get(caller)) {
      case (null) { Map.empty<Text, TripPlan>() };
      case (?existing) { existing };
    };
    userTripPlans.add(buildingId, tripPlan);
    tripPlans.add(caller, userTripPlans);

    tripPlan;
  };

  public query ({ caller }) func getTripPlans() : async [TripPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trip plans");
    };

    switch (tripPlans.get(caller)) {
      case (null) { [] };
      case (?userPlans) { userPlans.values().toArray().sort(TripPlan.compareByCreatedAt) };
    };
  };

  public query ({ caller }) func getTripPlan(id : Text) : async TripPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trip plans");
    };

    switch (tripPlans.get(caller)) {
      case (null) { Runtime.trap("Trip plan not found") };
      case (?userPlans) {
        switch (userPlans.get(id)) {
          case (null) { Runtime.trap("Trip plan not found") };
          case (?plan) { plan };
        };
      };
    };
  };

  public shared ({ caller }) func deleteTripPlan(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete trip plans");
    };

    switch (tripPlans.get(caller)) {
      case (null) { Runtime.trap("Trip plan not found") };
      case (?userPlans) {
        if (not userPlans.containsKey(id)) {
          Runtime.trap("Trip plan not found");
        };
        userPlans.remove(id);
        tripPlans.add(caller, userPlans);
        true;
      };
    };
  };

  // #endregion

  // #region Expense Functions

  public shared ({ caller }) func addExpense(
    tripId : Text,
    date : Text,
    category : Text,
    amount : Float,
    note : Text,
  ) : async Expense {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add expenses");
    };

    if (amount <= 0 or tripId == "") {
      Runtime.trap("Invalid expense parameters");
    };

    // Verify the trip belongs to the caller
    switch (tripPlans.get(caller)) {
      case (null) { Runtime.trap("Trip plan not found") };
      case (?userPlans) {
        if (not userPlans.containsKey(tripId)) {
          Runtime.trap("Trip plan not found");
        };
      };
    };

    let expenseId = generateId();

    let expense : Expense = {
      id = expenseId;
      tripId;
      date;
      category;
      amount;
      note;
    };

    let userExpenses = switch (expenses.get(caller)) {
      case (null) { Map.empty<Text, Expense>() };
      case (?existing) { existing };
    };
    userExpenses.add(expenseId, expense);
    expenses.add(caller, userExpenses);

    expense;
  };

  public query ({ caller }) func getExpenses(tripId : Text) : async [Expense] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view expenses");
    };

    // Verify the trip belongs to the caller
    switch (tripPlans.get(caller)) {
      case (null) { Runtime.trap("Trip plan not found") };
      case (?userPlans) {
        if (not userPlans.containsKey(tripId)) {
          Runtime.trap("Trip plan not found");
        };
      };
    };

    switch (expenses.get(caller)) {
      case (null) { [] };
      case (?userExpenses) {
        let filtered = userExpenses.values().filter(
          func(expense) { expense.tripId == tripId }
        );
        filtered.toArray().sort(Expense.compareByAmount);
      };
    };
  };

  public shared ({ caller }) func deleteExpense(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete expenses");
    };

    switch (expenses.get(caller)) {
      case (null) { Runtime.trap("Expenses not found") };
      case (?userExpenses) {
        if (not userExpenses.containsKey(id)) {
          Runtime.trap("Expense not found");
        };
        userExpenses.remove(id);
        expenses.add(caller, userExpenses);
        true;
      };
    };
  };

  // #endregion
};
