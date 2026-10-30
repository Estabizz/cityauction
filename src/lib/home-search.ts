import { PROPERTY_CATEGORIES, AUCTION_TYPES } from "./constants";
import { BUDGET_RANGES } from "./buyer";
import { CITY_LIST } from "@/content/cities/list";
import { cityPath } from "@/content/cities/paths";

export function homeSearchHref(input: { location: string; category: string; budget: string; channel: string }) {
  const city = CITY_LIST.find((item) => item.slug === input.location);
  const category = PROPERTY_CATEGORIES.find((item) => item.value === input.category);
  const budget = BUDGET_RANGES.find((item) => item.value === input.budget);
  const channel = AUCTION_TYPES.find((item) => item.value === input.channel);
  if (city && !category && !budget && !channel) return cityPath(city);
  const params = new URLSearchParams();
  if (city) params.set("city", city.city);
  if (category) params.set("category", category.value);
  if (channel) params.set("auctionType", channel.value);
  if (budget && "min" in budget) params.set("minPrice", String(budget.min));
  if (budget && "max" in budget) params.set("maxPrice", String(budget.max));
  return params.size ? `/auctions?${params}` : "/auctions";
}
