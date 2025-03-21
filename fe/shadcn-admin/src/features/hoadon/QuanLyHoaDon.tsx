import TasksProvider from '../tasks/context/tasks-context';
import { Header } from '@/components/layout/header';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/layout/main';
import * as React from "react"
import TimKiemHoaDon from './TimKiemHoaDon';
import TableHoaDon from './TableHoaDon';

const QuanLyHoaDon: React.FC = () => {
    return (
        <>
            <div>
                <TasksProvider>
                    <Header>
                        <Search />
                        <div className="ml-auto flex items-center space-x-4">
                            <ThemeSwitch />
                            <ProfileDropdown />
                        </div>
                    </Header>
                </TasksProvider>
            </div>
            <Main>
                <div>
                    <div className='mb-[8px]'>
                        <h2 className='text-2xl font-bold tracking-tight'>Quản lý sản phẩm</h2>
                    </div>
                    <TimKiemHoaDon/> <br />
                    <TableHoaDon/>
                </div>
            </Main>
        </>
    );
};

export default QuanLyHoaDon;