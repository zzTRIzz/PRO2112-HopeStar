import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { StatusSwitch } from './components/status-switch'
import { TasksDialogs } from './components/wifi-dialogs'
import { TasksPrimaryButtons } from './components/wifi-primary-buttons'
import TasksProvider from './context/wifis-context'
import type { Wifi } from './data/schema'

const columns: ColumnDef<Wifi>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      // Lấy index của row và cộng thêm 1 vì index bắt đầu từ 0
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'name',
    header: 'Loại',
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const wifi = row.original as Wifi
      return <StatusSwitch wifi={wifi} />
    },
  },
]

export default function Wifi() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Wifi</h2>
            <p className='text-muted-foreground'>
              Đây là danh sách các wifi của bạn!
            </p>
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
