import { logger } from "@/lib/observability/logger";
import { createClient } from "@/lib/supabase/server";

export async function getActiveClubs() {
  const supabase = await createClient();
  const result = await supabase
    .from("clubs")
    .select("id, name, description, address, courts (id, surface_type, price)")
    .eq("active", true)
    .order("name");

  if (result.error) {
    logger.error("Failed to load active clubs", result.error, {
      operation: "clubs.list",
    });
  }

  return result;
}
