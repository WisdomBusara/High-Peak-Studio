import type { Access } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Anonymous visitors only ever see published documents; CMS users see drafts too.
export const publishedOrAuthenticated: Access = ({ req: { user } }) =>
  user ? true : { published: { equals: true } }

export const staffOnly = {
  read: authenticated,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}

export const publicContent = {
  read: publishedOrAuthenticated,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}

export const publicMedia = {
  read: anyone,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}
