export enum ErrorMessages {
  MUST_HAVE_VALID_BODY = 'Message must have a valid template name or an html or text body',
  MUST_HAVE_VALID_CHANNEL = 'Message must have a valid channel',
  MUST_HAVE_VALID_SMS_RECIPIENT = 'SMS must have at least one recipient with a valid phone number',
  MUST_HAVE_VALID_EMAIL_RECIPIENT = 'EMAIL must have at least one recipient with a valid email',
}
