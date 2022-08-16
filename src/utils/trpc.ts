import { createReactQueryHooks } from '@trpc/react'
import type { AppRouter } from 'pages/api/trpc/[trpc]'

import type { inferProcedureOutput, inferProcedureInput, inferSubscriptionOutput } from '@trpc/server'

export type TQuery = keyof AppRouter['_def']['queries']
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

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
