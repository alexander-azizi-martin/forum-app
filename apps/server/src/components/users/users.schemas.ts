import joi from 'joi';

export const username = joi
  .string()
  .label('Username')
  .pattern(/^[\w-]+$/)
  .message('Letters, numbers, dashes, and underscores only')
  .min(3)
  .message('Username must be between 3 and 20 characters')
  .max(20)
  .message('Username must be between 3 and 20 characters')
  .required();

export interface Credentials {
  username: string;
  password: string;
}

export const credentials = joi.object({
  username,
  password: joi.string().required(),
});
