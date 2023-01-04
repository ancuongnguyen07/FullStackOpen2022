import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

const blog = {
    title: 'First blog',
    author: 'A author',
    url: 'foo.bar',
    likes: 5
}

const mockUpdateLike = jest.fn()
const mockRemoveBlog = jest.fn()

describe('Toggle component of showing blogs', () => {
    let container

    beforeEach(() => {
        container = render(
            <Blog blog={blog}
                updateLike={mockUpdateLike}
                removeBlog={mockRemoveBlog} />
        ).container
    })

    test('Showing title and author by default', async () => {
        await screen.findAllByText(blog.author)
        await screen.findAllByText(blog.title)
    })

    test('Does not render URL or number of likes by default', () => {

    })
})