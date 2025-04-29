import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8080/api'

export const getUserChats = async () => {
  const jwt = Cookies.get('jwt')

  const response = await axios.get(`${API_BASE_URL}/chat/user-chat`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  return response.data
}

export const getChatHistory = async (senderId:number, receiverId: number) => {
  const jwt = Cookies.get('jwt')

  const response = await axios.get(
    `${API_BASE_URL}/chat/history?senderId=${senderId}&receiverId=${receiverId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  )
  return response.data
}
