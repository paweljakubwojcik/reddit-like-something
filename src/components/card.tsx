import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'

type CardProps = ComponentPropsWithoutRef<'div'>

export const Card: FC<CardProps> = ({ className, children }) => {
    return (
        <div
            className={classnames(
                'shadow rounded m-2 border border-basic/20 bg-slate-900 py-2 px-4',
                className
            )}
        >
            {children}
        </div>
    )
}
