import * as trpcNext from '@trpc/server/adapters/next'
import { posts } from 'server/post'
import { createRouter } from 'utils/create-router'

export const appRouter = createRouter().merge('posts.', posts)

// export type definition of API
export type AppRouter = typeof appRouter

// export API handler
export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => null,
})
