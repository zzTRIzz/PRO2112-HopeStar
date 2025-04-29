import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/rom-dialogs'
import { TasksPrimaryButtons } from './components/rom-primary-buttons'
import { StatusSwitch } from './components/status-switch'
import TasksProvider from './context/roms-context'
import type { Rom } from './data/schema'

const columns: ColumnDef<Rom>[] = [
  {
    accessorKey: 'id',
    header: 'STT', // Số thứ tự
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'capacity',
    header: 'Dung lượng',
    cell: ({ row }) => {
      const rom = row.original as Rom
      return <div>{rom.capacity}</div>
    },
    filterFn: (row, id, value) => {
      return row.getValue(id) === Number(value)
    },
  },
  {
    accessorKey: 'description',
    header: 'Loại',
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const rom = row.original as Rom
      return <StatusSwitch rom={rom} />
    },
  },
]

export default function Rom() {
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
            <h2 className='text-2xl font-bold tracking-tight'>ROM</h2>
            <p className='text-muted-foreground'>
              Đây là danh sách các ROM của bạn!
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
