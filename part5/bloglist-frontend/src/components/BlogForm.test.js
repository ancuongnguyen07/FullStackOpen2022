import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test('<BlogForm /> filling information and calls onSubmit', async () => {
    const newBlog = {
        author: 'new author',
        title: 'new title',
        url: 'new.url.com'
    }

    const mockAddBlog = jest.fn()
    const user = userEvent.setup()

    const container = render(<BlogForm addBlog={mockAddBlog} />).container
    // console.log(container)

    const authorInput = container.querySelector('#Author-input')
    const titleInput = container.querySelector('#Title-input')
    const urlInput = container.querySelector('#URL-input')
    const saveButton = screen.getByText('save')

    await user.type(authorInput, newBlog.author)
    await user.type(titleInput, newBlog.title)
    await user.type(urlInput, newBlog.url)
    await user.click(saveButton)
    
    const response = mockAddBlog.mock.calls

    expect(response).toHaveLength(1)
    expect(response[0][0].title).toBe(newBlog.title)
    expect(response[0][0].author).toBe(newBlog.author)
    expect(response[0][0].url).toBe(newBlog.url)
    // console.log(mockAddBlog.mock.calls)
})