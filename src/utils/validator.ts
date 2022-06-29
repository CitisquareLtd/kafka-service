import { IMessage } from '../models/i-message';
import { isEmail } from 'validator';

export default class Validator {
  public validateNotification(message: IMessage): boolean {
    // message must have a valid template name or an html or text body
    if (
      String(message.template || '').length < 5 &&
      String(message.html || '').length < 5 &&
      String(message.text || '').length < 5
    ) {
      throw new Error(
        'Message must have a valid template name or an html or text body'
      );
    }

    //channels must be an array and must contain at least one channel

    return true;
  }
}
