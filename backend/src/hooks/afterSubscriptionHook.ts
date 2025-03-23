import { createToken } from '@/utils/jwt'
import type { CollectionAfterOperationHook } from 'payload'

export const afterSubscriptionHook: CollectionAfterOperationHook<'subscribers'> = async ({
  result,
  operation,
  req,
}) => {
  const payload = req.payload

  if (operation === 'create') {
    // Send email to the subscriber
    const token = createToken({
      email: result.email,
      id: result.id,
    })

    const validationLink = `${process.env.FRONTEND_URL}/validate?token=${token}`
    console.log(`Send email to ${result.email} with validation link: ${validationLink}`)

    void payload.sendEmail({
      to: result.email,
      subject: 'Please validate your subscription',
      text: `Click this link to validate your newsletter subscription: ${validationLink}`,
    })
  }

  return result
}
