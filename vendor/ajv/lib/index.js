import Ajv from "ajv";

export const validate = (schema) => {
  const ajv = new Ajv();
  const validator = ajv.compile(schema);

  return (data) => {
    const isValid = validator(data);
    const errors = isValid ? undefined : validator.errors;
    return { isValid, errors };
  };
};

export const validateSchema = (schema, throwOrLogError) => {
  const ajv = new Ajv();
  return ajv.validateSchema(schema, throwOrLogError);
};
