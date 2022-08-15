import { createReactQueryHooks } from '@trpc/react'
import type { AppRouter } from 'pages/api/trpc/[trpc]'

export const {
    Provider,
    createClient,
    useContext,
    useDehydratedState,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useSubscription,
} = createReactQueryHooks<AppRouter>()

