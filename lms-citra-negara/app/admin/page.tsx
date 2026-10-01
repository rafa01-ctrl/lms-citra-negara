import { redirect } from "next/navigation";

/**
 * Alias untuk dashboard admin.
 * Dashboard utama dilayani route group (dashboard) di root "/".
 */
export default function AdminIndex() {
  redirect("/");
}
