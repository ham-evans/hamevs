import { redirect } from "next/navigation";

// The fueling plan now lives inside the crew guide — each stop carries its own
// Fuel block, and the drop-bag lists are at the bottom of that page. Kept as a
// redirect so any link already shared with crew still lands somewhere useful.
export default function FuelingPlan() {
  redirect("/running/leadville-100-2026/crew");
}
