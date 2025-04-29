import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/screen-dialogs'
import { TasksPrimaryButtons } from './components/screen-primary-buttons'
import { StatusSwitch } from './components/status-switch'
import TasksProvider from './context/screens-context'
import type { Screen } from './data/schema'

const columns: ColumnDef<Screen>[] = [
  {
    accessorKey: 'id',
    header: 'STT', // Số thứ tự
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'type',
    header: 'Loại',
  },
  {
    accessorKey: 'displaySize',
    header: 'Kích thước màn hình',
    cell: ({ row }) => {
      const screen = row.original as Screen
      return <div>{screen.displaySize}"</div>
    },
  },
  {
    accessorKey: 'resolution',
    header: 'Độ phân giải',
    cell: ({ row }) => {
      const screen = row.original as Screen
      return (
        <div>
          {screen.resolution.width}x{screen.resolution.height} (
          {screen.resolution.resolutionType})
        </div>
      )
    },
  },
  {
    accessorKey: 'refreshRate',
    header: 'Tần số quét',
    cell: ({ row }) => {
      const screen = row.original as Screen
      return <div>{screen.refreshRate} Hz</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const screen = row.original as Screen
      return <StatusSwitch screen={screen} />
    },
  },
]

export default function Screen() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Màn hình</h2>
            <p className='text-muted-foreground'>
              Đây là danh sách các màn hình của bạn!
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
