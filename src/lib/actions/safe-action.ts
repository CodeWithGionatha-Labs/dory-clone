import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export class CustomError extends Error {}

export const actionClient = createSafeActionClient({
  handleReturnedServerError: (error) => {
    if (error instanceof CustomError) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
