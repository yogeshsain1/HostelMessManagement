import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SubmitFeedbackPage() {
  const [meal, setMeal] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleSubmit = () => {
    setFeedbackMsg("Feedback submitted! Thank you.");
    setMeal("");
    setRating(5);
    setComment("");
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Mess Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input placeholder="Meal Name" value={meal} onChange={e => setMeal(e.target.value)} />
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} />
          </div>
          <Input placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)} />
          <Button onClick={handleSubmit}>Submit Feedback</Button>
          {feedbackMsg && <div className="text-green-600 mt-2">{feedbackMsg}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
