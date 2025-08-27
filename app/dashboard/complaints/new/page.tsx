import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ComplaintForm } from "@/components/hostel/complaint-form"

export default function NewComplaintPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File a Complaint</h1>
          <p className="text-muted-foreground mt-1">
            Report any issues or concerns about hostel facilities and services.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ComplaintForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
