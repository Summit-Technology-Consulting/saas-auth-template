import { fetch } from "@/lib/utils";
import { User } from "@/types/user.types";
import { useState } from "react";

export const useFetchUserProfile = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const data = await fetch<User>("/profile", {
        method: "GET",
      });

      setProfile(data);
    } catch (err) {
      setError("Failed to load profile data");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchProfile, loading, error, profile };
};
