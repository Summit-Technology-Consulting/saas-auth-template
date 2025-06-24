"use client";

import React from "react";
import styles from "./profile-section.module.css";

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

interface ProfileSectionProps {
  profile: UserProfile;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
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
          <label className={styles.label}>User ID</label>
          <div className={styles.value}>{profile.id}</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Credits</label>
          <div className={styles.value}>
            <span className={styles.credits}>{profile.credits}</span>
            <span className={styles.creditsLabel}>credits remaining</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Current Plan</label>
          <div className={styles.value}>
            <span className={`${styles.plan} ${styles[profile.plan.name]}`}>
              {profile.plan.name.charAt(0).toUpperCase() +
                profile.plan.name.slice(1)}
            </span>
          </div>
        </div>

        {profile.plan.subscription_id && (
          <div className={styles.field}>
            <label className={styles.label}>Subscription ID</label>
            <div className={styles.value}>
              <code className={styles.code}>
                {profile.plan.subscription_id}
              </code>
            </div>
          </div>
        )}

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
