"use client";

import useUser from "@/hooks/useUser";
import { fetch } from "@/lib/utils";
import { User } from "@/types/user.types";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./plan-card.module.css";

interface PlanCardProps {
  profile: User;
}

const PlanCard: React.FC<PlanCardProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, updateUser, isCanceled, isProPlan } = useUser();

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch<{ url: string; message?: string }>(
        "/stripe/create-checkout-session?name=pro",
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res && res.url) {
        window.location.href = res.url;
      }

      if (res && res.message) {
        toast.success(res.message);
        updateUser({ plan: { ...user.plan, name: "pro" } });
      }
    } catch (err) {
      setError("Failed to upgrade plan");
      console.error("Error upgrading plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!profile.plan.subscription_id) {
      setError("No active subscription to cancel");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      router.push("/cancel");
    } catch (err) {
      setError("Failed to cancel subscription");
      console.error("Error canceling subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Subscription Plan</h2>
        <div className={`${styles.badge} ${styles[profile.plan.name]}`}>
          {profile.plan.name.toUpperCase()}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.planInfo}>
          <div className={styles.planName}>
            {isProPlan ? "Pro Plan" : "Free Plan"}
          </div>
          <div className={styles.planDescription}>
            {isProPlan
              ? "Unlimited access to all features with priority support"
              : "Basic access with limited features"}
          </div>
        </div>

        {isProPlan && (
          <div className={styles.subscriptionInfo}>
            <div className={styles.field}>
              <label className={styles.label}>Subscription Status</label>
              <div className={styles.value}>
                <span
                  className={clsx(styles.status, {
                    canceled: isCanceled,
                  })}
                >
                  {profile.plan.name === "pro" ? "Active" : "Cancelling Soon"}
                </span>
              </div>
            </div>

            {profile.plan.expires_at && !isCanceled && (
              <div className={styles.field}>
                <label className={styles.label}>Next Billing Date</label>
                <div className={styles.value}>
                  {new Date(profile.plan.expires_at * 1000).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          {!isProPlan || profile.plan.name == "canceled" ? (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className={styles.upgradeButton}
            >
              {profile.plan.name !== "canceled"
                ? "Upgrade to pro"
                : "Reactivate Subscription"}
            </button>
          ) : (
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className={styles.cancelButton}
            >
              {loading ? "Processing..." : "Cancel Subscription"}
            </button>
          )}
        </div>

        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>Plan Features</h3>
          <ul className={styles.featuresList}>
            {isProPlan ? (
              <>
                <li className={styles.feature}>✅ Unlimited API calls</li>
                <li className={styles.feature}>✅ Priority support</li>
                <li className={styles.feature}>✅ Advanced analytics</li>
                <li className={styles.feature}>✅ Custom integrations</li>
                <li className={styles.feature}>✅ Team collaboration</li>
              </>
            ) : (
              <>
                <li className={styles.feature}>✅ 100 API calls per month</li>
                <li className={styles.feature}>✅ Basic support</li>
                <li className={styles.feature}>❌ Advanced analytics</li>
                <li className={styles.feature}>❌ Custom integrations</li>
                <li className={styles.feature}>❌ Team collaboration</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
