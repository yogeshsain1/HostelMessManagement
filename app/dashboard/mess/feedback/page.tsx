import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FeedbackForm } from "@/components/mess/feedback-form"

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mess Feedback</h1>
          <p className="text-muted-foreground mt-1">
            Help us improve by sharing your feedback about the mess services.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <FeedbackForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
