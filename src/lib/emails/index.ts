export type {
  WelcomeEmailInput,
  OrderConfirmationEmailInput,
  OrderEmailLineItem,
  ShippingEmailInput,
} from './templates'

export {
  buildWelcomeEmail,
  buildOrderConfirmationEmail,
  buildShippingEmail,
} from './templates'

export { createResendClient, sendResendEmail } from './sendViaResend'
export {
  EMAIL_BRAND_NAME,
  EMAIL_FROM_DEFAULT,
  EMAIL_LOGO_URL,
  EMAIL_SITE_ORIGIN,
  EMAIL_SUPPORT,
} from './brand'
