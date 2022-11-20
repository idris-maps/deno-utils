import { isAlphaNumOrUnderscore, startsWithNum } from "../utils.ts";
import { is } from "../deps.ts";
import { onError } from "./errors.ts";

const ERR = {
  notString: "table name must be a string",
  notDefined: "table name is undefined",
  notAlphaNum:
    "table name may only contain lower case alpha numeric characters and _ (underscore)",
  startsWithUnderscore: "table name may not start with _ (underscore)",
  startsWithNumber: "table name may not start with a number",
};

export const isTableName = is<string>((name) => {
  if (!name || String(name).trim() === "") {
    return onError(ERR.notDefined);
  }
  if (name !== String(name)) {
    return onError(ERR.notString);
  }
  if (!isAlphaNumOrUnderscore(name)) {
    return onError(ERR.notAlphaNum);
  }
  if (startsWithNum(name)) {
    return onError(ERR.startsWithNumber);
  }
  if (name[0] === "_") {
    return onError(ERR.startsWithUnderscore);
  }
  return true;
});
