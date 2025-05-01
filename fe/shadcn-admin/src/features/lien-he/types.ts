export enum ContactType {
  MUA_NHIEU = 'MUA_NHIEU',
  KHIEU_NAI = 'KHIEU_NAI',
  SPAM = 'SPAM',
  HO_TRO = 'HO_TRO'
}

export const contactTypeLabels: Record<ContactType, string> = {
  [ContactType.MUA_NHIEU]: 'Mua nhiều',
  [ContactType.KHIEU_NAI]: 'Khiếu nại',
  [ContactType.SPAM]: 'Spam',
  [ContactType.HO_TRO]: 'Hỗ trợ'
}

export const contactTypeColors: Record<ContactType, string> = {
  [ContactType.MUA_NHIEU]: '#22C55E',
  [ContactType.KHIEU_NAI]: '#EF4444',
  [ContactType.SPAM]: '#6B7280',
  [ContactType.HO_TRO]: '#3B82F6'
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

export interface ContactResponse {
  status: number
  message: string
  data: Contact[]
}

export interface ReplyRequest {
  contactIds: number[]
  reply: string
}
