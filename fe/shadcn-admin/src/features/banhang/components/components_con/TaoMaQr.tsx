import React, { useEffect, useState } from 'react';
import { BillRespones } from '../../service/Schema';
import { format } from 'date-fns';
import { fromThanhCong, fromThatBai } from './ThongBao';
interface Props {
  searchBill: BillRespones | undefined;
  tongTien: number;
  dateTime: Date
  isBanGiaoHang: boolean;
  handleThanhToan: (
    status: string,
    billType: number | undefined
  ) => void;
}
const TaoMaQr: React.FC<Props> = ({ searchBill, tongTien, dateTime, handleThanhToan, isBanGiaoHang }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (!searchBill || !tongTien) return;
    const description = `Thanh toan hoa don ${searchBill?.code}`;
    const encodedDesc = encodeURIComponent(description);
    console.log('encodedDesc', encodedDesc);
    const qrUrl = `https://qr.sepay.vn/img?acc=VQRQABXEW9226&bank=MBBank&amount=${tongTien}&des=${encodedDesc}`;
    setQrCodeUrl(qrUrl);
  }, [searchBill, tongTien]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const desc = `Thanh toan hoa don ${searchBill?.code}`;
        const encodedDesc = encodeURIComponent(desc);
        const date = encodeURIComponent(format(dateTime, "yyyy-MM-dd HH:mm:ss"));

        const res = await fetch(`http://localhost:8080/api/sepay/check-payment?desc=${encodedDesc}&transaction_date_min=${date}`);
        const data = await res.json();
        console.log('Received response:', data);

        if (data.isPaid) {
          setIsPaid(true);
          clearInterval(interval);
          // fromThanhCong("Giao dịch đã được thanh toán thành công!");
          if (isBanGiaoHang == true) {
            handleThanhToan("DA_XAC_NHAN", 1);
          } else {
            handleThanhToan("HOAN_THANH", 0)
          }
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        fromThatBai("Giao dịch chưa được thanh toán!");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [searchBill, dateTime]);


  return (
    <div className="text-center space-y-2">
      {/* Hiển thị mã QR nếu chưa thanh toán và có qrCodeUrl */}
      {qrCodeUrl && !isPaid && <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-[200px]" />}

      {/* Nếu đã thanh toán, hiển thị thông báo hoặc ẩn mã QR */}
      {/* {isPaid && <p className="text-green-600">Giao dịch đã được thanh toán!</p>} */}
    </div>
  );
};

export default TaoMaQr;
