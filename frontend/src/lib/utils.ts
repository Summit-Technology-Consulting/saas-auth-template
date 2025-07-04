import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { nextApi } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetch<T>(
  url: string,
  options?: AxiosRequestConfig,
  onSubscriptionExpired?: () => void
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
      console.error(error?.response?.data);

      if (error.response?.status === 307) {
        window.location.href = error.response.data.url;
        return null;
      } else {
        console.error(JSON.stringify(error.response?.data.error, null, 2));
      }

      if (error.response?.status && error.response?.status >= 400) {
        const errorMessage = error.response?.data.error;

        toast.error(errorMessage);

        if (
          typeof errorMessage === "string" &&
          /subscription has expired/i.test(errorMessage)
        ) {
          onSubscriptionExpired?.();

          return null;
        }

        return null;
      } else {
        console.error(JSON.stringify(error.response?.data.error, null, 2));
      }
    }

    toast.error("An unexpected error occurred");
    return null;
  }
}
