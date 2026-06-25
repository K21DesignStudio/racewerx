import { DashboardProvider } from "@/state/store";
import { Dashboard } from "@/components/Dashboard";

export default function Page() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
