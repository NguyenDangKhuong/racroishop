export const __prod__ = process.env.NODE_ENV === 'production'
export const GRAPHQL_HOST = __prod__
  ? process.env.NEXT_PUBLIC_BACK_END_GRAPHQL_PROD
  : process.env.NEXT_PUBLIC_BACK_END_GRAPHQL_DEV
export const BACKEND_HOST = __prod__
  ? process.env.NEXT_PUBLIC_BACK_END_HOST_PROD
  : process.env.NEXT_PUBLIC_BACK_END_HOST_DEV
