import { ErrorMessages } from '../src/utils/error-messages';
import Validator from '../src/utils/validator';

const validator = new Validator();

describe('testing Validator', () => {
  test('message must have a valid template name or an html or text body', () => {
    try {
      expect(validator.validateNotification({})).toThrow(Error);
    } catch (error) {
      expect(error.message).toBe(ErrorMessages.MUST_HAVE_VALID_BODY);
      //   console.log(error);
    }
  });

  test('message must have a valid channel', () => {
    try {
      expect(validator.validateNotification({ template: 'verify-email' })).toThrow(
        Error
      );
    } catch (error) {
      expect(error.message).toBe(ErrorMessages.MUST_HAVE_VALID_CHANNEL);
      //   console.log(error);
    }
  });
});
