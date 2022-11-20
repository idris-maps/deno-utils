import { isAlphaNum } from "../utils.ts";
import { isRecord, replaceDiacritics } from "../deps.ts";

const labelToName = (label: string) =>
  Array.from(String(replaceDiacritics(label)))
    .map((d) => isAlphaNum(d.toLowerCase()) ? d.toLowerCase() : "_")
    .join("")
    .split("_")
    .filter((d) => d.trim() !== "")
    .join("_");

export const sanitizeForm = (form: unknown) => {
  const f = isRecord(form) ? { ...form } : {};

  if (f.name && !f.label) {
    f.label = f.name;
  }

  if (f.label && !f.name) {
    f.name = labelToName(String(f.label));
  }

  const fields = Array.isArray(f.fields) ? f.fields : [];
  f.fields = fields.map((d) => {
    if (isRecord(d)) {
      if (d.property && !d.label) {
        d.label = d.name;
      }
      if (d.label && !d.property) {
        d.property = labelToName(String(d.label));
      }
      return d;
    }
    return d;
  });

  return f;
};
