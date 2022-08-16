import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'
import type { Prisma } from '@prisma/client'
import { InferQueryOutput, useQuery } from 'utils/trpc'

type CommentT = NonNullable<InferQueryOutput<'posts.postById'>>['comments'][number]

type CommentProps = ComponentPropsWithoutRef<'div'> & {
    comment: CommentT
}

export const Comment: FC<CommentProps> = ({
    className,
    comment: {
        message,
        id,
        user: { name },
    },
}) => {
    const { data: childrenComments } = useQuery(['posts.comments', { parentCommentId: id, limit: 5 }])

    return (
        <div className={classnames('ml-2', className)}>
            <header>{name} wrote: </header>
            <div>{message}</div>
            {childrenComments?.map((comment) => (
                <Comment comment={comment} key={comment.id} />
            ))}
        </div>
    )
}
