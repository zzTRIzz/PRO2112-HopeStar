import { CircleIcon, FileIcon, PersonIcon } from "@radix-ui/react-icons"

export const statusOptions = [
  {
    value: "ACTIVE",
    label: "Hoạt động",
    icon: CircleIcon
  },
  {
    value: "INACTIVE",
    label: "Không hoạt động",
    icon: CircleIcon
  }
]

export const roleOptions = [
  {
    value: "Admin",
    label: "Admin",
    icon: PersonIcon
  },
  {
    value: "Nhân viên",
    label: "Nhân viên",
    icon: PersonIcon
  }
]

export const statuses = {
  ACTIVE: "success",
  INACTIVE: "error"
}

export const roles = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "staff",
    label: "Nhân viên",
  }
]
