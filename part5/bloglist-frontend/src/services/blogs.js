import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}

// create a new blog
const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


// update a blog
const update = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const id =  newObject.id

  const response =  await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

// delete a blog
const remove = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, update, remove, setToken }