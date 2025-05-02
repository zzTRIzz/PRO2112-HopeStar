import { ContactType } from '../types'
import { cn } from '@/lib/utils'

export const getContactTypeStyle = (type: ContactType) => {
  switch (type) {
    case ContactType.MUA_NHIEU:
      return {
        text: "Mua nhiều",
        className: "bg-blue-100 text-blue-800"
      }
    case ContactType.KHIEU_NAI:
      return {
        text: "Khiếu nại",
        className: "bg-red-100 text-red-800"
      }
    case ContactType.SPAM:
      return {
        text: "Spam",
        className: "bg-gray-100 text-gray-800"
      }
    case ContactType.HO_TRO:
      return {
        text: "Hỗ trợ",
        className: "bg-green-100 text-green-800"
      }
  }
}

export const getContactStatusStyle = (replied: boolean) => {
  return replied
    ? {
        text: "Đã phản hồi",
        className: "bg-green-100 text-green-800"
      }
    : {
        text: "Chưa phản hồi",
        className: "bg-yellow-100 text-yellow-800"
      }
}

export const getContactStyleClass = (base: string, type: ContactType) => {
  const style = getContactTypeStyle(type)
  return cn(base, style.className)
}

export const getStatusStyleClass = (base: string, replied: boolean) => {
  const style = getContactStatusStyle(replied)
  return cn(base, style.className)
}
