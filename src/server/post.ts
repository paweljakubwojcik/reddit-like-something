import { createRouter } from 'utils/create-router'
import { z } from 'zod'

export const posts = createRouter().query('posts', {
    input: z
        .object({
            text: z.string().nullish(),
        })
        .nullish(),
    resolve({ input }) {
        return {
            greeting: 'Elo',
        }
    },
})
