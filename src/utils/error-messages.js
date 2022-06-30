"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["MUST_HAVE_VALID_BODY"] = "Message must have a valid template name or an html or text body";
    ErrorMessages["MUST_HAVE_VALID_CHANNEL"] = "Message must have a valid channel";
    ErrorMessages["MUST_HAVE_VALID_SMS_RECIPIENT"] = "SMS must have at least one recipient with a valid phone number";
    ErrorMessages["MUST_HAVE_VALID_EMAIL_RECIPIENT"] = "EMAIL must have at least one recipient with a valid email";
    ErrorMessages["MUST_HAVE_VALID_RECIPIENT"] = "EMAIL must have at least one recipient";
})(ErrorMessages = exports.ErrorMessages || (exports.ErrorMessages = {}));
