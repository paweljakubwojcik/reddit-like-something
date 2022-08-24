import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'
import { useQuery } from 'utils/trpc'
import Link from 'next/link'
import { NextPage } from 'next'
import { Card } from 'components/card'

type FeedPageProps = ComponentPropsWithoutRef<'div'>

const FeedPage: NextPage<FeedPageProps> = ({ className }) => {
    const { isLoading, data: posts, error } = useQuery(['posts.posts'], { ssr: true, keepPreviousData: true })

    if (error) {
        return <pre>{JSON.stringify(error, null, 4)}</pre>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {posts?.map(({ id, title, _count }) => (
                <Link href={`post/${id}`} key={id}>
                    <a>
                        <Card className='hover:scale-105 transition-transform'>
                            <div className="font-bold">{title}</div>
                            <div>{_count.comments} comments</div>
                        </Card>
                    </a>
                </Link>
            ))}
        </>
    )
}

export default FeedPage
