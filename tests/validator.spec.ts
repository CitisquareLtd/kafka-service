 
import Validator from '../src/utils/validator';

const validator = new Validator();
 
describe('testing Validator', () => {
  test('message must have a valid template name or an html or text body', () => {
   try {
    expect(validator.validateNotification({

    }))
    
    .toThrow(new Error('Message must have a valid template name or an html or text body'));
   } catch (error) {
    // console.log(error);
   }
  });

  test('message must have a valid channel', () => {
    try {
     expect(validator.validateNotification({
        template: 'verify-email',
     }))
     
     .toThrow(new Error('Message must have a valid template name or an html or text body'));
    } catch (error) {
     // console.log(error);
    }
   });
});