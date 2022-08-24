import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'

type LayoutProps = ComponentPropsWithoutRef<'div'>

export const Layout: FC<LayoutProps> = ({ className, children }) => {
    return <div className={classnames('mx-auto max-w-xl', className)}>{children}</div>
}
