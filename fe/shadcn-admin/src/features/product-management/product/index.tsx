import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/product-dialogs'
import { StatusSwitch } from './components/status-switch'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { getProducts } from './data/api-service'
import type { ProductResponse } from './data/schema'

const columns: ColumnDef<ProductResponse>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
  },
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'totalNumber',
    header: 'Total',
    cell: ({ row }) => {
      const product = row.original as ProductResponse
      return (
        <div className='flex items-center gap-1'>
          <span>{product.totalNumber}</span>
          <span className='text-muted-foreground'>
            ({product.totalVersion} version)
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const product = row.original as ProductResponse
      return <StatusSwitch product={product} />
    },
  },
]

export default function Product() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center text-2xl'>
        Loading...
      </div>
    )
  if (error)
    return (
      <div className='mt-9 flex h-screen items-center justify-center text-2xl'>
        Error: {error.message}
      </div>
    )

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
            <h2 className='text-2xl font-bold tracking-tight'>Product</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your product for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={products} columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
