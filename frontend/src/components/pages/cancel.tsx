import { useFetchUserProfile } from "@/hooks/use-fetch-user-profile";
import useUser from "@/hooks/useUser";
import { User } from "@/types/user.types";
import { AlertTriangle, Check, Home, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./cancel.module.css";

type CancelState = "confirm" | "loading" | "success" | "error";

const Cancel = () => {
  const { fetchProfile, loading, error, profile } = useFetchUserProfile();
  const { updateUser } = useUser();
  const [state, setState] = useState<CancelState>("confirm");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleInitialLoad = async () => {
      try {
        await fetchProfile();
      } catch (err) {
        setState("error");
        setErrorMessage("An error occurred while loading your profile");
        console.error("Error loading profile:", err);
      }
    };

    handleInitialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      setState("error");
      setErrorMessage("Failed to fetch profile");
    }
  }, [error]);

  const handleCancelSubscription = async () => {
    if (!profile?.plan.subscription_id) {
      setErrorMessage("No active subscription to cancel");
      setState("error");
      return;
    }

    setState("loading");

    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to cancel subscription");
      }

      // Update user state
      const userData: Partial<User> = {
        plan: {
          name: "free",
          subscription_id: null,
          expires_at: null,
        },
      };
      updateUser(userData);

      setState("success");
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
      console.error("Error cancelling subscription:", err);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderConfirmState = () => (
    <>
      <div className={styles.warningIcon}>
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className={styles.confirmTitle}>Cancel Subscription</h1>
      <p className={styles.confirmSubtitle}>
        Are you sure you want to cancel your subscription? This action cannot be
        undone.
      </p>

      {profile && (
        <div className={styles.subscriptionDetails}>
          <h3 className={styles.detailsTitle}>Current Subscription</h3>
          <div className={styles.detailInfo}>
            <span className={styles.detailLabel}>Plan:</span>
            <span className={styles.detailValue}>
              {profile.plan.name || "Free"}
            </span>
          </div>
          <div className={styles.detailInfo}>
            <span className={styles.detailLabel}>Expires:</span>
            <span className={styles.detailValue}>
              {formatDate(profile.plan.expires_at)}
            </span>
          </div>
        </div>
      )}

      <div className={styles.warningBox}>
        <h4 className={styles.warningTitle}>What happens when you cancel:</h4>
        <ul className={styles.warningList}>
          <li>
            Your subscription will remain active until the end of the current
            billing period
          </li>
          <li>
            You&apos;ll lose access to Pro features after the current period
            ends
          </li>
          <li>Your account will be downgraded to the Free plan</li>
          <li>You can resubscribe at any time</li>
        </ul>
      </div>

      <div className={styles.actionButtons}>
        <button
          onClick={handleCancelSubscription}
          className={styles.cancelButton}
        >
          Yes, Cancel Subscription
        </button>
        <Link href="/settings" className={styles.keepButton}>
          Keep Subscription
        </Link>
      </div>
    </>
  );

  const renderLoadingState = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>Cancelling your subscription...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        <X className="h-6 w-6" />
      </div>
      <h2 className={styles.errorTitle}>Something went wrong</h2>
      <p className={styles.errorMessage}>{errorMessage}</p>
      <div className={styles.actionButtons}>
        <button
          className={styles.primaryButton}
          onClick={() => setState("confirm")}
        >
          Try Again
        </button>
        <Link href="/settings" className={styles.secondaryButton}>
          <Settings className="h-4 w-4" />
          Back to Settings
        </Link>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <>
      <div className={styles.successIcon}>
        <Check className="h-8 w-8" />
      </div>
      <h1 className={styles.successTitle}>Subscription Cancelled</h1>
      <p className={styles.successSubtitle}>
        Your subscription has been cancelled successfully. You&apos;l continue
        to have access to Pro features until the end of your current billing
        period.
      </p>

      <div className={styles.infoBox}>
        <h4 className={styles.infoTitle}>What&apos;s next:</h4>
        <ul className={styles.infoList}>
          <li>
            Your account will be downgraded to Free at the end of the current
            period
          </li>
          <li>You can resubscribe anytime from your settings</li>
          <li>Your data will be preserved</li>
        </ul>
      </div>

      <div className={styles.actionButtons}>
        <Link href="/" className={styles.primaryButton}>
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Link>
        <Link href="/settings" className={styles.secondaryButton}>
          <Settings className="h-4 w-4" />
          View Settings
        </Link>
      </div>
    </>
  );

  if (loading && state === "confirm") {
    return (
      <div className={styles.container}>
        <div className={styles.cancelCard}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>
              Loading your subscription details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.cancelCard}>
        {state === "confirm" && renderConfirmState()}
        {state === "loading" && renderLoadingState()}
        {state === "error" && renderErrorState()}
        {state === "success" && renderSuccessState()}
      </div>
    </div>
  );
};

export default Cancel;
