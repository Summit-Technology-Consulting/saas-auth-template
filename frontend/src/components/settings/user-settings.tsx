"use client";

import { useFetchUserProfile } from "@/hooks/use-fetch-user-profile";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import PlanCard from "./plan-card";
import ProfileSection from "./profile-section";
import styles from "./user-settings.module.css";

const UserSettings: React.FC = () => {
  const { profile, loading, error, fetchProfile } = useFetchUserProfile();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
