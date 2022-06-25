import {
  isError,
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
} from 'utilities/errors';

describe('Errors', () => {
  test.each([
    [UserInputError, 400],
    [AuthenticationError, 401],
    [ForbiddenError, 403],
    [NotFoundError, 404],
    [ConflictError, 409],
    [ServerError, 500],
  ])('%p', (Error, errorCode) => {
    const errorMessage = `This is a ${Error.name}`;
    const errorInstance = new Error(errorMessage);

    expect(isError(errorInstance)).toBe(true);
    expect(errorInstance.statusCode).toBe(errorCode);
    expect(errorInstance.message).toBe(errorMessage);
  });

  test('isError returns false for non errors', () => {
    expect(isError('')).toBe(false);
    expect(isError([])).toBe(false);
    expect(isError({})).toBe(false);
    expect(isError(1)).toBe(false);
  });
});
