import { NextPage } from 'next'
import Link from 'next/link'
import { useQuery } from 'utils/trpc'

const IndexPage: NextPage = () => {
    const { isLoading, data: posts, error } = useQuery(['posts.posts'], { ssr: true, keepPreviousData: true })

    if (error) {
        return <pre>{JSON.stringify(error, null, 4)}</pre>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {posts?.map(({ id, title }) => (
                <div key={id}>
                    <Link href={`post/${id}`}>
                        <a>{title}</a>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default IndexPage
