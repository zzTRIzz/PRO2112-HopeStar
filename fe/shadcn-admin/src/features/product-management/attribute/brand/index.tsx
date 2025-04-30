import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/brand-dialogs'
import { TasksPrimaryButtons } from './components/brand-primary-buttons'
import { DataTable } from './components/data-table'
import { StatusSwitch } from './components/status-switch'
import TasksProvider from './context/brands-context'
import type { Brand } from './data/schema'
import { IconQuestionMark } from '@tabler/icons-react'

const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      // Lấy index của row và cộng thêm 1 vì index bắt đầu từ 0
      return <div>{row.index + 1}</div>
    },
  },
  {
      accessorKey: 'imageUrl',
      header: 'Hình ảnh',
      cell: ({ row }) => (
        <div className='h-20 w-16'>
          {row.original.imageUrl ? (
            <img
              src={row.original.imageUrl}
              alt={`${row.original.name}`}
              className='h-full w-full rounded-sm object-contain'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-lg bg-muted'>
              <IconQuestionMark className='h-6 w-6' />
            </div>
          )}
        </div>
      ),
    },
  {
    accessorKey: 'name',
    header: 'Tên thương hiệu', // Chuyển sang tiếng Việt
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái', // Chuyển sang tiếng Việt
    cell: ({ row }) => {
      const brand = row.original as Brand
      return <StatusSwitch brand={brand} />
    },
  },
]

export default function Brand() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Thương hiệu</h2>{' '}
            {/* Chuyển sang tiếng Việt */}
            <p className='text-muted-foreground'>
              Danh sách các thương hiệu của bạn! {/* Chuyển sang tiếng Việt */}
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
