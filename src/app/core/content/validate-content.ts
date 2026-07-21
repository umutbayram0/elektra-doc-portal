import Ajv2020 from 'ajv/dist/2020';

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateContent(schema: object, data: unknown): ContentValidationResult {
  const ajv = new Ajv2020({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  return {
    valid,
    errors: (validate.errors ?? []).map(error => `${error.instancePath || '(root)'} ${error.message}`)
  };
}
