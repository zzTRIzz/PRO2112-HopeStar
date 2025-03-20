import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/front-camera-dialogs'
import { TasksPrimaryButtons } from './components/front-camera-primary-buttons'
import { StatusSwitch } from './components/status-switch'
import TasksProvider from './context/front-cameras-context'
import type { FrontCamera } from './data/schema'

const columns: ColumnDef<FrontCamera>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'type',
    header: 'Loại',
  },
  {
    accessorKey: 'resolution',
    header: 'Độ phân giải',
    cell: ({ row }) => {
      const camera = row.original as FrontCamera
      return <div>{camera.resolution} MP</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const camera = row.original as FrontCamera
      return <StatusSwitch frontCamera={camera} />
    },
  },
]

export default function FrontCamera() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Camera trước</h2>
            <p className='text-muted-foreground'>
              Danh sách camera trước của bạn!
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
