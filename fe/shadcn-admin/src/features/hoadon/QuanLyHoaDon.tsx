import TasksProvider from '../tasks/context/tasks-context';
import { Header } from '@/components/layout/header';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/layout/main';
import * as React from "react"
import TableHoaDon from './components/TableHoaDon';
import { getAllBill } from './service/HoaDonService';
import { Bill } from './service/HoaDonSchema';

const QuanLyHoaDon: React.FC = () => {
     const [listHoaDon, setListHoaDon] = React.useState<Bill[]>([]);
        React.useEffect(() => {
            loadHoaDon();
        }, []);
    
    
        const loadHoaDon = async () => {
            try {
                const data = await getAllBill();
                setListHoaDon(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
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
                    {/* <TimKiemHoaDon listHoaDon={listHoaDon} setListHoaDon={setListHoaDon} /> <br /> */}
                    <TableHoaDon listHoaDon={listHoaDon} />
                </div> <br />
            </Main>
        </>
    );
};

export default QuanLyHoaDon;