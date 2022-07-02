import joi from 'joi';

export interface RefreshToken {
  refreshToken: string;
}

export const refreshToken = joi.object({
  refreshToken: joi
    .string()
    .uuid({ version: 'uuidv4' })
    .message('Refresh token is malformed')
    .required(),
});
