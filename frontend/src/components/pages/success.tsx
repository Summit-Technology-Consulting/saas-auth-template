import { useFetchUserProfile } from "@/hooks/use-fetch-user-profile";
import useUser from "@/hooks/useUser";
import { User } from "@/types/user.types";
import { Check, Home, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./success.module.css";

type SuccessState = "loading" | "success" | "error";

const Success = () => {
  const { fetchProfile, loading, error, profile } = useFetchUserProfile();
  const { updateUser } = useUser();
  const [state, setState] = useState<SuccessState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        await fetchProfile();
      } catch (err) {
        setState("error");
        setErrorMessage("An error occurred while updating your profile");
        console.error("Error in success flow:", err);
      }
    };

    handleSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      setState("error");
      setErrorMessage("Failed to fetch updated profile");
    } else if (!loading && profile) {
      const userData: Partial<User> = {
        plan: profile.plan,
      };

      updateUser(userData);
      setState("success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderLoadingState = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>Updating your subscription...</p>
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
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <Link href="/" className={styles.secondaryButton}>
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <>
      <div className={styles.successIcon}>
        <Check className="h-8 w-8" />
      </div>
      <h1 className={styles.successTitle}>Payment Successful!</h1>
      <p className={styles.successSubtitle}>
        Your subscription has been updated successfully. You now have access to
        all the features of your new plan.
      </p>

      {profile && (
        <div className={styles.planDetails}>
          <h3 className={styles.planTitle}>Your New Plan Details</h3>
          <div className={styles.planInfo}>
            <span className={styles.planLabel}>Plan:</span>
            <span className={styles.planValue}>
              {profile.plan.name || "Free"}
            </span>
          </div>
          <div className={styles.planInfo}>
            <span className={styles.planLabel}>Expires:</span>
            <span className={styles.planValue}>
              {formatDate(profile.plan.expires_at)}
            </span>
          </div>
        </div>
      )}

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

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        {state === "loading" && renderLoadingState()}
        {state === "error" && renderErrorState()}
        {state === "success" && renderSuccessState()}
      </div>
    </div>
  );
};

export default Success;
