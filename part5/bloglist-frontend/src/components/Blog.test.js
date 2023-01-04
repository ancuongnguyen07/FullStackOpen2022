import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
    author: 'A author hihi',
    title: 'First Title hihi',
    likes: 10
}

const mockUpdateLike = jest.fn()
const mockRemoveBlog = jest.fn()

describe('Blog component', () => {
    let container

    beforeEach(() => {
        container = render(
            <Blog blog={blog}
            updateLike={mockUpdateLike}
            removeBlog={mockRemoveBlog}
            />
        ).container
    })

    test('showing author and title by default', () => {
        const alwaysShowed = container.querySelector('.alwaysShowed')
        expect(alwaysShowed).toHaveTextContent(blog.author)
        expect(alwaysShowed).toHaveTextContent(blog.title)
    })

    test('not showing url and likes by default', () => {
        const alwaysShowed = container.querySelector('.alwaysShowed')
        expect(alwaysShowed).not.toHaveTextContent(blog.url)
        expect(alwaysShowed).not.toHaveTextContent(blog.likes)
    })


    test('showing url and likes when a "view" button clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const hidenDiv = container.querySelector('.hiden')
        expect(hidenDiv).not.toHaveStyle('display: none')

    })

    test('Double clicking LIKE button twice, the handle func called twice', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('like')
        await user.click(button)
        await user.click(button)

        expect(mockUpdateLike.mock.calls).toHaveLength(2)
    })
})