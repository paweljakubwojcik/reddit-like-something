import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'
import { GetStaticPaths, NextPage } from 'next'
import { useQuery } from 'utils/trpc'
import { useRouter } from 'next/router'
import { Comment } from 'components/comment'
import { Card } from 'components/card'
import { Send } from 'react-feather'

const PostPage: NextPage = () => {
    const router = useRouter()
    const id = router.query.post as string

    const { data: post, isLoading, error } = useQuery(['posts.postById', { id }])

    if (isLoading) {
        return <>Loading...</>
    }

    return (
        <div className={classnames('')}>
            <Card>
                <h1>{post?.title}</h1>
                <section>{post?.body}</section>
            </Card>
            <section>
                <form
                    className="flex m-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}
                >
                    <textarea
                        className="resize-none bg-transparent border-basic/20 border rounded w-full p-2 focus:outline-none"
                        rows={2}
                    />
                    <button className="px-6 py-2">
                        <Send />
                    </button>
                </form>
            </section>
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
