import { MaintenancePage } from "@/components/ui/maintenance-page"

export const dynamic = "force-dynamic"

export default function Page() {
  return <MaintenancePage />
}

export const metadata = {
  title: "Under Maintenance | Back Soon",
  description: "Our site is under maintenance. We will be back in an hour!",
}
