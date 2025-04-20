import Navbar from '@/features/ui-client/components/navbar';
import ThongTinDonHang from '@/features/ui-client/pages/tra_cuu_don_hang/componement/ThongTinDonHang';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/(auth)/tra_cuu_don_hang/thong-tin')({
    component: RouteComponent,
})

function RouteComponent() {
    useEffect(() => {
        document.title = 'Thông tin đơn hàng | HopeStar';
        return () => {
            document.title = 'HopeStar';
        };
    }, []);
    return (
        <>
            <Navbar />
            < ThongTinDonHang />
        </>
    )
}
