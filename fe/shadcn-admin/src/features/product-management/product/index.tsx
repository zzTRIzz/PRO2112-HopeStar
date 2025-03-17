import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { DataTable } from './components/data-table';
import { TasksDialogs } from './components/product-dialogs';
import { StatusSwitch } from './components/status-switch';
import { TasksPrimaryButtons } from './components/tasks-primary-buttons';
import TasksProvider from './context/tasks-context';
import { getProducts, searchProducts } from './data/api-service';
import type { ProductResponse, SearchProductRequest } from './data/schema';

const columns: ColumnDef<ProductResponse>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      // Lấy index của row và cộng thêm 1 vì index bắt đầu từ 0
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'code',
    header: 'Mã',
  },
  {
    accessorKey: 'name',
    header: 'Tên sản phẩm',
  },
  {
    accessorKey: 'totalNumber',
    header: 'Tổng số lượng',
    cell: ({ row }) => {
      const product = row.original as ProductResponse;
      return (
        <div className='flex items-center gap-1'>
          <span>{product.totalNumber}</span>
          <span className='text-muted-foreground'>
            ({product.totalVersion} phiên bản)
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const product = row.original as ProductResponse;
      return <StatusSwitch product={product} />;
    },
  },
];

export default function Product() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // State cho các filter
  const [searchValue, setSearchValue] = useState('');
  const [idChip, setIdChip] = useState<number | undefined>(undefined);
  const [idBrand, setIdBrand] = useState<number | undefined>(undefined);
  const [idScreen, setIdScreen] = useState<number | undefined>(undefined);
  const [idCard, setIdCard] = useState<number | undefined>(undefined);
  const [idOs, setIdOs] = useState<number | undefined>(undefined);
  const [idWifi, setIdWifi] = useState<number | undefined>(undefined);
  const [idBluetooth, setIdBluetooth] = useState<number | undefined>(undefined);
  const [idBattery, setIdBattery] = useState<number | undefined>(undefined);
  const [idCategory, setIdCategory] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Gọi API getProducts khi vào trang
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Gọi API searchProducts khi có thay đổi trong filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Nếu không có giá trị tìm kiếm hoặc filter, gọi getProducts
        if (!searchValue && !idChip && !idBrand && !idScreen && !idCard && !idOs && !idWifi && !idBluetooth && !idBattery && !idCategory && !status) {
          const data = await getProducts();
          setProducts(data);
          return;
        }

        // Nếu có giá trị tìm kiếm hoặc filter, gọi searchProducts
        const searchProductRequest: SearchProductRequest = {
          key: searchValue,
          idChip,
          idBrand,
          idScreen,
          idCard,
          idOs,
          idWifi,
          idBluetooth,
          idBattery,
          idCategory,
          status,
        };
        const data = await searchProducts(searchProductRequest);
        setProducts(data);
      } catch (error) {
        setError(error as Error);
      }
    };

    fetchData();
  }, [searchValue, idChip, idBrand, idScreen, idCard, idOs, idWifi, idBluetooth, idBattery, idCategory, status]);

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center text-2xl'>
        Đang tải...
      </div>
    );

  if (error)
    return (
      <div className='mt-9 flex h-screen items-center justify-center text-2xl'>
        Lỗi: {error.message}
      </div>
    );

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
            <h2 className='text-2xl font-bold tracking-tight'>Quản lý sản phẩm</h2>
            <p className='text-muted-foreground'>
              Danh sách sản phẩm của bạn trong hệ thống
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={products}
            columns={columns}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            idChip={idChip}
            setIdChip={setIdChip}
            idBrand={idBrand}
            setIdBrand={setIdBrand}
            idScreen={idScreen}
            setIdScreen={setIdScreen}
            idCard={idCard}
            setIdCard={setIdCard}
            idOs={idOs}
            setIdOs={setIdOs}
            idWifi={idWifi}
            setIdWifi={setIdWifi}
            idBluetooth={idBluetooth}
            setIdBluetooth={setIdBluetooth}
            idBattery={idBattery}
            setIdBattery={setIdBattery}
            idCategory={idCategory}
            setIdCategory={setIdCategory}
            status={status}
            setStatus={setStatus}
          />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  );
}