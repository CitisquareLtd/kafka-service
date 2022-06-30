"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i_channel_1 = require("../src/models/i-channel");
const error_messages_1 = require("../src/utils/error-messages");
const validator_1 = __importDefault(require("../src/utils/validator"));
const validator = new validator_1.default();
describe('testing Validator', () => {
    test('message must have a valid template name or an html or text body', () => {
        try {
            expect(validator.validateNotification({})).toThrow(Error);
        }
        catch (error) {
            expect(error.message).toBe(error_messages_1.ErrorMessages.MUST_HAVE_VALID_BODY);
            //   console.log(error);
        }
    });
    test('message must have a valid channel', () => {
        try {
            expect(validator.validateNotification({ template: 'verify-email' })).toThrow(Error);
        }
        catch (error) {
            expect(error.message).toBe(error_messages_1.ErrorMessages.MUST_HAVE_VALID_CHANNEL);
            //   console.log(error);
        }
    });
    test('message must have at least one recipient', () => {
        try {
            expect(validator.validateNotification({
                template: 'verify-email',
                channels: [i_channel_1.IChannel.SMS],
                //   recipients: [],
            })).toThrowError(Error);
        }
        catch (error) {
            expect(error.message).toBe(error_messages_1.ErrorMessages.MUST_HAVE_VALID_RECIPIENT);
            // console.log(error);
        }
    });
    test('message must have a valid sms recipient', () => {
        try {
            expect(validator.validateNotification({
                template: 'verify-email',
                channels: [i_channel_1.IChannel.SMS],
                recipients: [{ phone: '+254712345678' }],
            })).toBe(true);
            expect(validator.validateNotification({
                template: 'verify-email',
                channels: [i_channel_1.IChannel.SMS],
                recipients: [{}],
            })).toThrowError(Error);
        }
        catch (error) {
            expect(error.message).toBe(error_messages_1.ErrorMessages.MUST_HAVE_VALID_SMS_RECIPIENT);
            // console.log(error);
        }
    });
    test('message must have a valid email recipient', () => {
        try {
            expect(validator.validateNotification({
                template: 'verify-email',
                channels: [i_channel_1.IChannel.EMAIL],
                recipients: [{ email: 'ade@ciitisquare.net' }],
            })).toBe(true);
            expect(validator.validateNotification({
                template: 'verify-email',
                channels: [i_channel_1.IChannel.EMAIL],
                recipients: [{}],
            })).toThrow(Error);
        }
        catch (error) {
            expect(error.message).toBe(error_messages_1.ErrorMessages.MUST_HAVE_VALID_EMAIL_RECIPIENT);
            //   console.log(error);
        }
    });
});
