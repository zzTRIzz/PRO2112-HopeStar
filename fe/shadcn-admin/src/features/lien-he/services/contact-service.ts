import axios from 'axios'
import { Contact, ContactResponse, ContactType, ReplyRequest } from '../types'
import Cookies from 'js-cookie'

const API_URL = 'http://localhost:8080/api/lien-he'

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const jwt = Cookies.get('jwt')
    const response = await axios.get<ContactResponse>(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching contacts:', error)
    throw error
  }
}

export const getContactDetail = async (id: number): Promise<Contact> => {
  try {
    const jwt = Cookies.get('jwt')
    const response = await axios.get<ContactResponse>(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching contact detail:', error)
    throw error
  }
}

export const replyToContacts = async (data: ReplyRequest): Promise<ContactResponse['data']> => {
  try {
    const jwt = Cookies.get('jwt')
    const response = await axios.post<ContactResponse>(`${API_URL}/reply`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Error sending reply:', error)
    throw error
  }
}
