# Smart Budget AI Travel Guide

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User authentication (login/signup) to save trip plans and expenses
- Budget Planner: input form for destination, days, travelers, total budget, preferences; output a detailed cost breakdown (transport, accommodation, food, sightseeing, misc)
- AI Itinerary Generator: day-by-day itinerary based on preferences and budget, using heuristic/rule-based logic with curated Indian destination data
- Expense Tracker: log daily expenses per trip, view remaining budget, overspending alerts, spending breakdown chart
- Static/mock weather data for popular Indian destinations (temperature, rainfall, season info)
- Best-time-to-visit info per destination using static seasonal data
- Dashboard to list saved trips

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- User identity via Internet Identity (authorization component)
- Data types: TripPlan, Expense, DailyExpense
- TripPlan: id, destination, days, travelers, totalBudget, preferences, itinerary (array of DayPlan), costBreakdown, createdAt
- DayPlan: day number, activities (array of strings), estimatedCost
- CostBreakdown: transport, accommodation, food, sightseeing, misc, total
- Expense: id, tripId, date, category, amount, note
- CRUD for TripPlans (create, read, list, delete per user)
- CRUD for Expenses (add, list by trip, delete)
- generateItinerary: given destination + preferences + days + budget, return itinerary and cost breakdown (rule-based logic with curated destination data)

### Frontend (React + TypeScript)
- Auth flow: login with Internet Identity, logout
- Dashboard: list of saved trips, create new trip button
- Trip Planner page: form (destination selector from curated list, days, travelers, budget, preferences checkboxes), submit to generate plan
- Plan Results page: show cost breakdown, day-by-day itinerary, weather/season info for destination, save trip button
- Expense Tracker page (per trip): add expense form, expense list, remaining budget display, overspending alert banner, pie/bar chart of spending by category
- Static weather/seasonal data embedded in frontend for ~20 popular Indian destinations
- Responsive layout with mobile support
