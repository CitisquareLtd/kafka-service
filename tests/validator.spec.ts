import { IChannel } from '../src/models/i-channel';
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

  test('message must have at least one recipient', () => {
    try {
      
  

      expect(
        validator.validateNotification({
          template: 'verify-email',
          channels: [IChannel.SMS],
        //   recipients: [],
        })
      ).toThrowError(Error);
    } catch (error) {
      expect(error.message).toBe(ErrorMessages.MUST_HAVE_VALID_RECIPIENT);
        // console.log(error);
    }

     
  });

  test('message must have a valid sms recipient', () => {
    try {
      expect(
        validator.validateNotification({
          template: 'verify-email',
          channels: [IChannel.SMS],
          recipients: [{ phone: '+254712345678' }],
        })
      ).toBe(true);

  

      expect(
        validator.validateNotification({
          template: 'verify-email',
          channels: [IChannel.SMS],
          recipients: [{}],
        })
      ).toThrowError(Error);
    } catch (error) {
      expect(error.message).toBe(ErrorMessages.MUST_HAVE_VALID_SMS_RECIPIENT);
        // console.log(error);
    }

     
  });


  test('message must have a valid email recipient', () => {
    
    try {
        expect(
            validator.validateNotification({
              template: 'verify-email',
              channels: [IChannel.EMAIL],
              recipients: [{ email: 'ade@ciitisquare.net' }],
            })
          ).toBe(true);
      expect(
        validator.validateNotification({
          template: 'verify-email',
          channels: [IChannel.EMAIL],
          recipients: [{}],
        })
      ).toThrow(Error);
    } catch (error) {
      expect(error.message).toBe(ErrorMessages.MUST_HAVE_VALID_EMAIL_RECIPIENT);
      //   console.log(error);
    }
  });
});
