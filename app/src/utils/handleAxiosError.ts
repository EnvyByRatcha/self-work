import axios from "axios";
import type { ErrorResponse } from "../interface/IError";

export const handleAxiosError = (
  error: unknown,
  action: string
): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      message:
        error.response?.data?.message || `An error occurred while ${action}.`,
    };
  }

  return {
    success: false,
    message: "Unexpected error occurred",
  };
};
