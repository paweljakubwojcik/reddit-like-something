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
        resolve: async ({ input: { id } }) =>
            await prisma.post.findUnique({
                where: {
                    id,
                },
                include: {
                    comments: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        where: {
                            parentCommentId: null,
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            }),
    })
    .query('comments', {
        input: z.object({ parentCommentId: z.string(), after: z.string().optional(), limit: z.number() }),
        resolve: async ({ input: { parentCommentId, after, limit } }) =>
            await prisma.comment.findMany({
                where: {
                    parentCommentId,
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
            }),
    })
