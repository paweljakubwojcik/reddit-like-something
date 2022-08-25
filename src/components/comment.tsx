import classnames from 'classnames'
import format from 'date-fns/format'
import { ComponentPropsWithoutRef, FC, useState } from 'react'
import { useQueryClient } from 'react-query'
import { InferQueryOutput, useMutation, useQuery } from 'utils/trpc'
import { v4 as uuid } from 'uuid'
import { Card } from './card'
import { CommentForm } from './comment-form'
import { useAutoAnimate } from '@formkit/auto-animate/react'
export type CommentT = NonNullable<InferQueryOutput<'posts.comments'>>[number]

type CommentProps = ComponentPropsWithoutRef<'div'> & {
    comment: CommentT
}

export const Comment: FC<CommentProps> = ({
    className,
    comment: {
        message,
        id,
        createdAt,
        postId,
        user: { name },
    },
}) => {
    const queryClient = useQueryClient()

    const { data: childrenComments } = useQuery(['posts.comments', { parentCommentId: id, limit: 5 }])

    const { mutate: addComment } = useMutation(['posts.addComment'], {
        onMutate: async ({ message }) => {
            type CommentQueryT = InferQueryOutput<'posts.comments'>
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(['posts.comments', { parentCommentId: id, limit: 5 }])

            // Snapshot the previous value
            const prevData =
                queryClient.getQueryData<CommentQueryT>([
                    'posts.comments',
                    { postId: id, limit: 5, parentCommentId: null },
                ]) || []

            // Optimistically update to the new value
            queryClient.setQueryData<CommentQueryT>(['posts.comments', { parentCommentId: id, limit: 5 }], (prev) => [
                {
                    message,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    postId: id,
                    userId: '',
                    id: uuid(),
                    user: { id: 'me', name: 'Me' },
                    parentCommentId: null,
                },
                ...(prev || []),
            ])

            // Return a context object with the snapshotted value
            return { prevData }
        },
        onError: (e, data, context) => {
            console.log(e)
            if (context?.prevData) {
                queryClient.setQueryData(['posts.comments', { parentCommentId: id, limit: 5 }], context?.prevData)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['posts.comments', { parentCommentId: id, limit: 5 }])
        },
    })

    const [isReplying, setIsReplying] = useState(false)

    const [parent] = useAutoAnimate<HTMLDivElement>()

    return (
        <div className={classnames('', className)}>
            <Card>
                <header className="flex">
                    <div>{name}</div>
                    <div className="ml-auto">{format(new Date(createdAt), 'dd MMM yyyy, HH:mm')}</div>
                </header>
                <div>{message}</div>
                <div>
                    <button onClick={() => setIsReplying((v) => !v)}>Reply</button>
                </div>
            </Card>

            <div className="pl-2 border-l ml-2 border-basic/20" ref={parent}>
                {isReplying && (
                    <CommentForm
                        onSubmit={async ({ message }) => {
                            addComment({
                                message,
                                postId,
                                userId: '7df393d6-5793-44ef-b429-70db0e7ffd9c',
                                parentCommentId: id,
                            })
                            setIsReplying(false)
                        }}
                    />
                )}
                {childrenComments?.map((comment) => (
                    <Comment comment={comment} key={comment.id} />
                ))}
            </div>
        </div>
    )
}
