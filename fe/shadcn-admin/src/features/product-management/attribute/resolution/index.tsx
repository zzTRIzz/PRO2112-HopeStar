import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/resolution-dialogs'
import { TasksPrimaryButtons } from './components/resolution-primary-buttons'
import TasksProvider from './context/resolutions-context'
import type { Resolution } from './data/schema'

const columns: ColumnDef<Resolution>[] = [
  {
    accessorKey: 'id',
    header: 'STT', // Số thứ tự
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'resolutionType',
    header: 'Loại',
  },
  {
    accessorKey: 'height',
    header: 'Chiều cao',
    cell: ({ row }) => {
      const resolution = row.original as Resolution
      return <div>{resolution.height}px</div>
    },
  },
  {
    accessorKey: 'width',
    header: 'Chiều rộng',
    cell: ({ row }) => {
      const resolution = row.original as Resolution
      return <div>{resolution.width}px</div>
    },
  },
]

export default function Resolution() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Độ phân giải</h2>
            <p className='text-muted-foreground'>
              Đây là danh sách các độ phân giải của bạn!
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
