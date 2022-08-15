import { NextPage } from 'next'
import { useQuery } from 'utils/trpc'

const IndexPage: NextPage = () => {
    const { isLoading, data } = useQuery(['posts.posts', { text: 'client' }], { ssr: true })
    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <p>{data?.greeting}</p>
        </div>
    )
}

export default IndexPage
