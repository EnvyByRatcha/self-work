import type { ErrorResponse } from "../interface/IError";

function isErrorResponse(res: any): res is ErrorResponse {
  return (
    res &&
    typeof res === "object" &&
    "success" in res &&
    res.success === false
  );
}

export function unwrapOrError<T extends object>(res: T | ErrorResponse): T {
  if (isErrorResponse(res)) {
    throw new Error(res.message);
  }
  return res; 
}
