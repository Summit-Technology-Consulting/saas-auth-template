"use client";

import useUser from "@/hooks/useUser";
import { User } from "@/types/user.types";
import clsx from "clsx";
import React from "react";
import styles from "./profile-section.module.css";

interface ProfileSectionProps {
  profile: User;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  const { isCanceled } = useUser();
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Profile Information</h2>
        <div className={styles.badge}>Account</div>
      </div>

      <div className={styles.content}>
        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <div className={styles.value}>{profile.username}</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <div className={styles.value}>{profile.email}</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Current Plan</label>
          <div className={styles.value}>
            <span
              className={clsx(`${styles.plan} ${styles[profile.plan.name]}`, {
                canceled: isCanceled,
              })}
            >
              {profile.plan.name.charAt(0).toUpperCase() +
                profile.plan.name.slice(1)}
            </span>
          </div>
        </div>

        {profile.plan.expires_at && (
          <div className={styles.field}>
            <label className={styles.label}>Plan Expires</label>
            <div className={styles.value}>
              {formatDate(profile.plan.expires_at)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
