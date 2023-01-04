import { useState } from 'react'

const FillForm = ({ title, value, handle }) => {
  return(
    <div>
      {title}
      <input
        id={`${title}-input`}
        type="text"
        value={value}
        name={title}
        onChange={handle}
      />
    </div>
  )
}

const BlogForm = ({ addBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleChangeAuthor = (event) => {
    setAuthor(event.target.value)
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleChangeUrl = (event) => {
    setUrl(event.target.value)
  }

  const handleAddBlog = (event) => {
    event.preventDefault()
    addBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return(
    <div>
      <h3>Create a new blog</h3>
      <form onSubmit={handleAddBlog}>
        <FillForm 
          title="Title"
          value={title}
          handle={handleChangeTitle}
        ></FillForm>
        <FillForm title="Author"
          value={author}
          handle={handleChangeAuthor}
        ></FillForm>
        <FillForm title="URL"
          value={url}
          handle={handleChangeUrl}
        ></FillForm>
        <button id='create-blog-button' type="submit">save</button>
      </form>
    </div>
  )

}

export default BlogForm