export enum ContactType {
  MUA_NHIEU = 'MUA_NHIEU',
  KHIEU_NAI = 'KHIEU_NAI',
  SPAM = 'SPAM',
  HO_TRO = 'HO_TRO'
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  content: string
  reply?: string
  type: ContactType
  createdAt: string
  updatedAt: string
}

export type FilterType = ContactType | 'ALL' | null;

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
}

export interface ContactResponse {
  status: number
  message: string
  data: Contact[]
}

export interface ReplyRequest {
  contactIds: number[]
  reply: string
}
