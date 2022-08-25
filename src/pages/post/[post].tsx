import classnames from 'classnames'
import { Card } from 'components/card'
import { Comment } from 'components/comment'
import { CommentForm } from 'components/comment-form'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Send } from 'react-feather'
import { useQueryClient } from 'react-query'
import { InferQueryOutput, useMutation, useQuery } from 'utils/trpc'
import { v4 as uuid } from 'uuid'

const PostPage: NextPage = () => {
    const router = useRouter()
    const id = router.query.post as string
    const queryClient = useQueryClient()

    const { data: post, ...postQuery } = useQuery(['posts.postById', { id }])
    const { data: comments, ...commentQuery } = useQuery([
        'posts.comments',
        { postId: id, limit: 5, parentCommentId: null },
    ])

    const { mutate: addComment } = useMutation(['posts.addComment'], {
        onMutate: async ({ message }) => {
            type CommentQueryT = InferQueryOutput<'posts.comments'>
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(['posts.comments', { postId: id, limit: 5, parentCommentId: null }])

            // Snapshot the previous value
            const prevData =
                queryClient.getQueryData<CommentQueryT>([
                    'posts.comments',
                    { postId: id, limit: 5, parentCommentId: null },
                ]) || []

            // Optimistically update to the new value
            queryClient.setQueryData<CommentQueryT>(
                ['posts.comments', { postId: id, limit: 5, parentCommentId: null }],
                (prev) => [
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
                ]
            )

            // Return a context object with the snapshotted value
            return { prevData }
        },
        onError: (e, data, context) => {
            console.log(e)
            if (context?.prevData) {
                queryClient.setQueryData(
                    ['posts.comments', { postId: id, limit: 5, parentCommentId: null }],
                    context?.prevData
                )
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['posts.comments', { postId: id, limit: 5, parentCommentId: null }])
        },
    })

    if ([postQuery.isLoading, commentQuery.isLoading].some(Boolean)) {
        return <>Loading...</>
    }

    return (
        <div className={classnames('')}>
            <Card>
                <h1>{post?.title}</h1>
                <section>{post?.body}</section>
            </Card>
            <section>
                <CommentForm
                    onSubmit={({ message }) =>
                        addComment({
                            message,
                            postId: id,
                            userId: '7df393d6-5793-44ef-b429-70db0e7ffd9c',
                        })
                    }
                />
            </section>
            <section>
                {comments?.map((comment) => (
                    <Comment comment={comment} key={comment.id} />
                ))}
            </section>
        </div>
    )
}

// export const getStaticProps: GetStaticPaths = async () => {

// }

// export const getStaticPaths: GetStaticPaths = async () => {

//     return { paths }
// }

export default PostPage
