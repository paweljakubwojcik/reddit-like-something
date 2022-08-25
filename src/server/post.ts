import { createRouter } from 'utils/create-router'
import { z } from 'zod'
import { prisma } from './prisma-client'

export const posts = createRouter()
    .query('posts', {
        resolve: async () =>
            await prisma.post.findMany({
                select: {
                    id: true,
                    title: true,
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            }),
    })
    .query('postById', {
        input: z.object({ id: z.string() }),
        resolve: ({ input: { id } }) =>
            prisma.post.findUnique({
                where: {
                    id,
                },
            }),
    })
    .query('comments', {
        input: z.object({
            parentCommentId: z.string().optional().nullable(),
            postId: z.string().optional(),
            after: z.string().optional(),
            limit: z.number(),
        }),
        resolve: async ({ input: { limit, after, ...rest } }) => {
            return await prisma.comment.findMany({
                where: {
                    ...rest,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                cursor: after
                    ? {
                          id: after,
                      }
                    : undefined,
                take: limit,
            })
        },
    })
    .mutation('addComment', {
        input: z.object({
            message: z.string(),
            postId: z.string(),
            userId: z.string(),
            parentCommentId: z.string().optional(),
        }),
        resolve: async ({ input: { message, postId, userId, parentCommentId } }) => {
            return await prisma.comment.create({
                data: {
                    message,
                    userId,
                    postId,
                    parentCommentId,
                },
            })
        },
    })
