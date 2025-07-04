import { nextApi } from "@/lib/api";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import useUser from "./useUser";

const SUBSCRIPTION_ERROR_PATTERNS = [
  /subscription has expired/i,
  /subscription expired/i,
  /subscription is invalid/i,
  /subscription not found/i,
  /payment required/i,
  /insufficient subscription/i,
];

export const useFetch = () => {
  const { updateUser } = useUser();

  const isSubscriptionError = (errorMessage: string): boolean => {
    return SUBSCRIPTION_ERROR_PATTERNS.some((pattern) =>
      pattern.test(errorMessage)
    );
  };

  const handleSubscriptionError = () => {
    updateUser({
      plan: { name: "free", subscription_id: null, expires_at: null },
    });
  };

  async function fetch<T>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await nextApi.request({
        url,
        ...options,
      });

      if (!response) {
        toast.error("No response received from server");
        return null;
      }

      if (response.status >= 400) {
        toast.error(`Error: ${response.statusText}`);
        return null;
      }

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("API Error:", error?.response?.data);

        // Handle redirects (like logout)
        if (error.response?.status === 307) {
          window.location.href = error.response.data.url;
          return null;
        }

        // Handle subscription-related errors
        if (error.response?.status && error.response?.status >= 400) {
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.detail ||
            "Unknown error";

          // Check if it's a subscription-related error
          if (
            typeof errorMessage === "string" &&
            isSubscriptionError(errorMessage)
          ) {
            handleSubscriptionError();
            return null;
          }

          // Handle other 4xx/5xx errors
          toast.error(errorMessage);
          return null;
        }

        // Log other errors for debugging
        console.error(
          "Unexpected API error:",
          JSON.stringify(error.response?.data, null, 2)
        );
      }

      toast.error("An unexpected error occurred");
      return null;
    }
  }

  return { fetch };
};
