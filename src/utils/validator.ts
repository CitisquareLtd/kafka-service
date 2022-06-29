import { IMessage } from '../models/i-message';
import { isEmail } from 'validator';
import { ErrorMessages } from './error-messages';

export default class Validator {
  static errorMe;
  public validateNotification(message: IMessage): boolean {
    // message must have a valid template name or an html or text body
    if (
      String(message.template || '').length < 5 &&
      String(message.html || '').length < 5 &&
      String(message.text || '').length < 5
    ) {
      throw new Error(ErrorMessages.MUST_HAVE_VALID_BODY);
    }

    //channels must be an array and must contain at least one channel
    if (
      !message.channels ||
      !message.channels.length ||
      message.channels.length < 1
    ) {
      throw new Error(ErrorMessages.MUST_HAVE_VALID_CHANNEL);
    }

    return true;
  }
}
