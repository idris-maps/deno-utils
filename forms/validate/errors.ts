const KNOWN_ERROR = "[validation error]";

export const onError = (message: string) => {
  throw new Error(KNOWN_ERROR + " " + message);
};

type Logger = (d: {
  level: "info" | "error";
  message: string;
  error?: unknown;
}) => void;

export const validationErrorToResponse = (err: Error, log?: Logger) => {
  if (err.message.startsWith(KNOWN_ERROR)) {
    if (log) log({ level: "info", message: err.message });
    return { status: 400, body: { message: err.message } };
  }

  if (log) log({ level: "error", message: err.message, error: err });
  return { status: 500 };
};
