import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'
import { GetStaticPaths, NextPage } from 'next'
import { useQuery } from 'utils/trpc'
import { useRouter } from 'next/router'
import { Comment } from 'components/comment'

const PostPage: NextPage = () => {
    const router = useRouter()
    const id = router.query.post as string

    const { data: post, isLoading, error } = useQuery(['posts.postById', { id }])

    if (isLoading) {
        return <>Loading...</>
    }

    return (
        <div className={classnames('')}>
            <h1>{post?.title}</h1>
            <section>{post?.body}</section>
            <section>
                {post?.comments.map((comment) => (
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
