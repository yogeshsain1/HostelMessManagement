import { ok, serverError } from "@/lib/api"

const WEEKLY_MENU = {
  monday: { breakfast: "Idli, Sambar, Chutney", lunch: "Dal, Rice, Sabzi, Roti", dinner: "Paneer Curry, Rice, Roti" },
  tuesday: { breakfast: "Poha, Tea", lunch: "Rajma, Rice, Roti, Salad", dinner: "Dal Makhani, Naan, Rice" },
  wednesday: { breakfast: "Paratha, Curd", lunch: "Chhole, Rice, Roti", dinner: "Mix Veg, Roti, Rice" },
  thursday: { breakfast: "Upma, Juice", lunch: "Dal Fry, Rice, Roti, Pickle", dinner: "Aloo Matar, Roti, Rice" },
  friday: { breakfast: "Poori, Aloo Sabzi", lunch: "Kadhi, Rice, Roti", dinner: "Palak Paneer, Naan, Rice" },
  saturday: { breakfast: "Bread, Butter, Jam, Tea", lunch: "Biryani, Raita, Salad", dinner: "Chole, Bhature, Rice" },
  sunday: { breakfast: "Puri, Halwa", lunch: "Special Thali (Dal, Sabzi, Rice, Roti, Sweet)", dinner: "Fried Rice, Manchurian, Roti" },
}

export async function GET() {
  try {
    return ok({ menu: WEEKLY_MENU })
  } catch (err) {
    return serverError("Failed to fetch menu", err)
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    return ok({ menu: { ...WEEKLY_MENU, ...json } })
  } catch (err) {
    return serverError("Failed to update menu", err)
  }
}
