"use client";

import useUser from "@/hooks/useUser";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import PlanCard from "./plan-card";
import ProfileSection from "./profile-section";
import styles from "./user-settings.module.css";

const UserSettings: React.FC = () => {
  const { user } = useUser();

  if (!user) {
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
        <ProfileSection profile={user} />
        <PlanCard profile={user} />
      </div>
    </div>
  );
};

export default UserSettings;
