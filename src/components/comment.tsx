import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'
import type { Prisma } from '@prisma/client'
import { InferQueryOutput, useQuery } from 'utils/trpc'
import { Card } from './card'
import format from "date-fns/format"


type CommentT = NonNullable<InferQueryOutput<'posts.postById'>>['comments'][number]

type CommentProps = ComponentPropsWithoutRef<'div'> & {
    comment: CommentT
}

export const Comment: FC<CommentProps> = ({
    className,
    comment: {
        message,
        id,
        createdAt,
        user: { name },
    },
}) => {
    const { data: childrenComments } = useQuery(['posts.comments', { parentCommentId: id, limit: 5 }])
    
    return (
        <div className={classnames('', className)}>
            <Card>
                <header className='flex'>
                    <div>{name}</div>
                    <div className='ml-auto'>{format(new Date(createdAt), "dd MMM yyyy, HH:mm")}</div>
                </header>
                <div>{message}</div>
            </Card>
            <div className="pl-2 border-l ml-2 border-basic/20">
                {childrenComments?.map((comment) => (
                    <Comment comment={comment} key={comment.id} />
                ))}
            </div>
        </div>
    )
}
