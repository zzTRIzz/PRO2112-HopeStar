import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/sim-dialogs'
import { TasksPrimaryButtons } from './components/sim-primary-buttons'
import { StatusSwitch } from './components/status-switch'
import TasksProvider from './context/sims-context'
import type { Sim } from './data/schema'

const columns: ColumnDef<Sim>[] = [
  {
    accessorKey: 'id',
    header: 'STT', // Số thứ tự
    cell: ({ row }) => {
      // Lấy index của row và cộng thêm 1 vì index bắt đầu từ 0
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'type',
    header: 'Loại',
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const sim = row.original as Sim
      return <StatusSwitch sim={sim} />
    },
  },
]

export default function Sim() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Quản lý SIM</h2>
            <p className='text-muted-foreground'>
              Đây là danh sách các SIM của bạn!
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
