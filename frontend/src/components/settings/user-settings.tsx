"use client";

import { fetch } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PlanCard from "./plan-card";
import ProfileSection from "./profile-section";
import styles from "./user-settings.module.css";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  credits: number;
  plan: {
    name: string;
    subscription_id: string | null;
    expires_at: number | null;
  };
}

const UserSettings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetch<UserProfile>("/profile", {
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

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No profile data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          <ArrowLeft className={styles.breadcrumbIcon} />
          Back to Home
        </Link>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Account Settings</h1>
        <p className={styles.subtitle}>Manage your account and subscription</p>
      </div>

      <div className={styles.content}>
        <ProfileSection profile={profile} />
        <PlanCard profile={profile} />
      </div>
    </div>
  );
};

export default UserSettings;
