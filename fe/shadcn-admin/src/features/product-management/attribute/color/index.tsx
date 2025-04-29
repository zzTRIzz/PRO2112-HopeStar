import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/color-dialogs'
import { TasksPrimaryButtons } from './components/color-primary-buttons'
import { DataTable } from './components/data-table'
import { StatusSwitch } from './components/status-switch'
import TasksProvider from './context/colors-context'
import type { Color } from './data/schema'

const columns: ColumnDef<Color>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      // Lấy index của row và cộng thêm 1 vì index bắt đầu từ 0
      return <div>{row.index + 1}</div>
    },
  },
  // {
  //   accessorKey: 'code',
  //   header: 'Code',
  // },
  {
    accessorKey: 'name',
    header: 'Tên',
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
  },
  {
    accessorKey: 'hex',
    header: 'Mã màu',
    cell: ({ row }) => {
      const color = row.original as Color
      return (
        <div className='flex items-center gap-2'>
          <div
            className='h-6 w-6 rounded border'
            style={{ backgroundColor: color.hex }}
          />
          <span>{color.hex}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const color = row.original as Color
      return <StatusSwitch color={color} />
    },
  },
]

export default function Color() {
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Màu sắc</h2>
            <p className='text-muted-foreground'>Danh sách màu sắc của bạn!</p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
