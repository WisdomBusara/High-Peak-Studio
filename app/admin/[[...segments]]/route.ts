import { payload } from 'payload'

const handlers = payload.plugin.rest()

export const GET = handlers.GET
export const POST = handlers.POST
export const DELETE = handlers.DELETE
export const PATCH = handlers.PATCH
