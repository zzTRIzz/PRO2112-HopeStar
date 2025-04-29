import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/battery-dialogs'
import { TasksPrimaryButtons } from './components/battery-primary-buttons'
import { DataTable } from './components/data-table'
import { StatusSwitch } from './components/status-switch'
import TasksProvider from './context/batteries-context'
import type { Battery } from './data/schema'

const columns: ColumnDef<Battery>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      // Lấy index của row và cộng thêm 1 vì index bắt đầu từ 0
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'type',
    header: 'Loại pin',
  },
  {
    accessorKey: 'capacity',
    header: 'Dung lượng',
    cell: ({ row }) => {
      const battery = row.original as Battery
      return <div>{battery.capacity} mAh</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const battery = row.original as Battery
      return <StatusSwitch battery={battery} />
    },
  },
]

export default function Battery() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Pin</h2>
            <p className='text-muted-foreground'>
              Đây là danh sách các pin của bạn!
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
