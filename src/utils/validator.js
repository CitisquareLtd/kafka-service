"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("validator");
const error_messages_1 = require("./error-messages");
const i_channel_1 = require("../models/i-channel");
class Validator {
    validateNotification(message) {
        // message must have a valid template name or an html or text body
        if (String(message.template || '').length < 5 &&
            String(message.html || '').length < 5 &&
            String(message.text || '').length < 5) {
            throw new Error(error_messages_1.ErrorMessages.MUST_HAVE_VALID_BODY);
        }
        //channels must be an array and must contain at least one channel
        if (!message.channels ||
            !message.channels.length ||
            message.channels.length < 1) {
            throw new Error(error_messages_1.ErrorMessages.MUST_HAVE_VALID_CHANNEL);
        }
        // channels must be an array and must contain at least one channel
        // console.log(message.channels.includes(IChannel.EMAIL));
        // console.log(message.channels);
        if (message.channels.includes(i_channel_1.IChannel.EMAIL)) {
            let validEmailRecipients = message.recipients.filter((recipient) => recipient.email && (0, validator_1.isEmail)(recipient.email));
            //   console.log('message.channels', validEmailRecipients);
            if (message.recipients.length < 1 || validEmailRecipients.length < 0) {
                throw new Error(error_messages_1.ErrorMessages.MUST_HAVE_VALID_EMAIL_RECIPIENT);
            }
        }
        if (message.channels.includes(i_channel_1.IChannel.SMS)) {
            let validSMSRecipients = message.recipients.filter((recipient) => recipient.phone && String(recipient.phone).length < 5);
            //   console.log('message.channels', validSMSRecipients);
            if (message.recipients.length < 1 || validSMSRecipients.length < 0) {
                throw new Error(error_messages_1.ErrorMessages.MUST_HAVE_VALID_SMS_RECIPIENT);
            }
        }
        return true;
    }
}
exports.default = Validator;
