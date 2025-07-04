import UserSettings from "@/components/settings/user-settings";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return <UserSettings />;
}
