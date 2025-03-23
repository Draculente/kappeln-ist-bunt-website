import { afterSubscriptionHook } from '@/hooks/afterSubscriptionHook'
import { verifyToken } from '@/utils/jwt'
import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
  },
  hooks: {
    afterOperation: [afterSubscriptionHook],
  },
  endpoints: [
    {
      path: '/subscribe',
      method: 'post',
      handler: async (req) => {
        if (!req || !req.json) return Response.json({ error: 'invalid request' }, { status: 400 })

        const data = await req.json()

        const email = data.email

        if (!email) {
          return Response.json({ error: 'email is required' }, { status: 400 })
        }

        // Check if valid email
        if (!email.includes('@') || email.lenght > 1000) {
          return Response.json({ error: 'invalid email' }, { status: 400 })
        }

        // Check if email already exists
        const existingSubscriber = await req.payload.find({
          collection: 'subscribers',
          where: {
            email,
          },
        })

        // If email exists and is validated
        if (existingSubscriber.docs[0].validated === true) {
          // Return error
          return Response.json({ error: 'email already exists' }, { status: 400 })
        } else if (!existingSubscriber.docs[0].validated) {
          // Delete existing subscriber
          await req.payload.delete({
            collection: 'subscribers',
            id: existingSubscriber.docs[0].id,
          })
        }

        const subscriber = await req.payload.create({
          collection: 'subscribers',
          data: {
            email,
          },
        })

        return Response.json(subscriber)
      },
    },
    {
      path: '/validate',
      method: 'post',
      handler: async (req) => {
        const token = req.query.token as string

        if (!token) {
          return Response.json({ error: 'token is required' }, { status: 400 })
        }

        const jwtPayload = verifyToken(token)

        if (!jwtPayload) {
          return Response.json({ error: 'invalid token' }, { status: 400 })
        }

        const subscriber = await req.payload.findByID({
          collection: 'subscribers',
          id: jwtPayload.id,
        })

        if (!subscriber) {
          return Response.json({ error: 'subscriber not found' }, { status: 404 })
        }

        if (subscriber.validated) {
          return Response.json({ error: 'subscriber already validated' }, { status: 400 })
        }

        await req.payload.update({
          collection: 'subscribers',
          id: jwtPayload.id,
          data: {
            validated: true,
          },
        })

        return Response.json({ message: 'subscriber validated' })
      },
    },
    {
      path: '/unsubscribe',
      method: 'post',
      handler: async (req) => {
        const token = req.query.token as string

        if (!token) {
          return Response.json({ error: 'token is required' }, { status: 400 })
        }

        const jwtPayload = verifyToken(token)

        if (!jwtPayload) {
          return Response.json({ error: 'invalid token' }, { status: 400 })
        }

        const subscriber = await req.payload.findByID({
          collection: 'subscribers',
          id: jwtPayload.id,
        })

        if (!subscriber) {
          return Response.json({ error: 'subscriber not found' }, { status: 404 })
        }

        await req.payload.delete({
          collection: 'subscribers',
          id: jwtPayload.id,
        })

        return Response.json({ message: 'subscriber unsubscribed' })
      },
    },
  ],
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'validated',
      label: 'Validated',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
