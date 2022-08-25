import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'
import { Send } from 'react-feather'

type CommentFormProps = {
    onSubmit: (values: { message: string }) => Promise<void> | void
    className?: string
}

export const CommentForm: FC<CommentFormProps> = ({ className, onSubmit }) => {
    return (
        <form
            className="flex m-2"
            onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const { message } = Object.fromEntries(formData) as { message: string }
                await onSubmit({ message });
                (e.target as HTMLFormElement).reset()
            }}
        >
            <textarea
                className="resize-none bg-transparent border-basic/20 border rounded w-full p-2 focus:outline-none"
                name="message"
                rows={2}
            />
            <button className="px-6 py-2">
                <Send />
            </button>
        </form>
    )
}
