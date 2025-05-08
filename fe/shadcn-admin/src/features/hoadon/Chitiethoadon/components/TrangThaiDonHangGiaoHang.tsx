import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, WalletCards, XOctagon, BadgeCheck, PackageSearch, PackageOpen, ClipboardCheck, Hourglass } from "lucide-react";
import { BillRespones } from "@/features/banhang/service/Schema";
import { huyHoaDon, updateStatus } from "../../service/HoaDonService";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react'
import { showErrorToast, showSuccessToast } from "./components_con/ThongBao";
import { updateTotalDue } from "../../service/HoaDonService";
import { ToastContainer } from "react-toastify";
import InvoiceTemplate from "./components_con/InHoaDon";
import ChiTiet from "./components_con/ChiTiet";
import { StatusBillHistory } from "../../service/Schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
// import { ColorFieldContext } from "react-aria-components";

interface StepProps {
  status: OrderStatus;
  step: OrderStatus;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
  color_bg: string;
  color_text: string;
  color_boder: string;
}

export type OrderStatus =
  | "CHO_XAC_NHAN"
  | "DA_XAC_NHAN"
  | "DANG_CHUAN_BI_HANG"
  | "DANG_GIAO_HANG"
  | "HOAN_THANH"
  | "DA_HUY"
  | "CAP_NHAT_DON_HANG"
  | "CHO_THANH_TOAN"
  ;

interface OrderStepperProps {
  currentStatus: OrderStatus;
  className?: string;
  searchBill: BillRespones | null;
}
const statusMap: Record<string, {
  title: string;
  icon: React.ReactNode;
  color_bg: string;
  color_text: string;
  color_boder: string;
}> = {
  CHO_XAC_NHAN: {
    title: "Chờ xác nhận",
    icon: <Hourglass className="w-6 h-6" />,
    color_bg: "bg-blue-100",
    color_text: "text-blue-600",
    color_boder: "border-blue-400",
  },
  DA_XAC_NHAN: {
    title: "Đã xác nhận",
    icon: <ClipboardCheck className="w-6 h-6" />,
    color_bg: "bg-blue-100",
    color_text: "text-blue-600",
    color_boder: "border-blue-400",
  },
  DANG_CHUAN_BI_HANG: {
    title: "Đang chuẩn bị hàng",
    icon: <PackageOpen className="w-6 h-6" />,
    color_bg: "bg-blue-100",
    color_text: "text-blue-600",
    color_boder: "border-blue-400",
  },
  DANG_GIAO_HANG: {
    title: "Đang giao hàng",
    icon: <PackageSearch className="w-6 h-6" />,
    color_bg: "bg-blue-100",
    color_text: "text-blue-600",
    color_boder: "border-blue-400",
  },
  HOAN_THANH: {
    title: "Hoàn thành",
    icon: <BadgeCheck className="w-6 h-6" />,
    color_bg: "bg-green-100",
    color_text: "text-green-600",
    color_boder: "border-green-400",
  },
  DA_HUY: {
    title: "Đã hủy",
    icon: <XOctagon className="w-6 h-6" />,
    color_bg: "bg-red-100",
    color_text: "text-red-600",
    color_boder: "border-red-400",
  },
  CHO_THANH_TOAN: {
    title: "Chờ thanh toán",
    icon: <WalletCards className="w-6 h-6" />,
    color_bg: "bg-blue-100",
    color_text: "text-blue-600",
    color_boder: "border-blue-400",
  },
  CAP_NHAT_DON_HANG: {
    title: "Cập nhật đơn hàng",
    icon: <RefreshCw className="w-6 h-6" />,
    color_bg: "bg-yellow-100",
    color_text: "text-yellow-600",
    color_boder: "border-yellow-400",
  },
};
interface OrderStepperProps {
  currentStatus: OrderStatus;
  className?: string;
  searchBill: BillRespones | null;
}
const statusHistoryToOrderStatus: Record<StatusBillHistory, OrderStatus> = {
  "Đã xác nhận ": "DA_XAC_NHAN",
  "Đang chuẩn bị hàng ": "DANG_CHUAN_BI_HANG",
  "Đang giao hàng ": "DANG_GIAO_HANG",
  "Hoàn thành ": "HOAN_THANH",
  "Đã hủy": "DA_HUY",
  "Chờ thanh toán": "CHO_XAC_NHAN",
  "Chờ xác nhận": "CHO_XAC_NHAN",
  "Cập nhật đơn hàng ": "CAP_NHAT_DON_HANG",
};

const OrderStepper: React.FC<OrderStepperProps> = ({
  currentStatus,
  searchBill
}) => {
  // Lấy danh sách lịch sử trạng thái
  const historySteps = searchBill?.billHistoryRespones || [];
  return (
    <div className="w-full overflow-x-auto h-[160px] pt-[15px]">
      <div className="flex gap-16 min-w-max px-2">
        {historySteps.map((item, index) => {
          const statusInfo = statusMap[item.actionType] || {
            title: "Không rõ trạng thái",
            icon: <Icon icon="lucide:alert-circle" className="w-4 h-4" />,
            color: "bg-gray-500"
          };
          const orderStatus = statusHistoryToOrderStatus[item.actionType];
          return (
            <Step
              key={index}
              status={currentStatus}
              step={orderStatus}
              title={statusInfo.title}
              description={new Date(item.actionTime).toLocaleDateString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
              icon={statusInfo.icon}
              isLast={index === historySteps.length - 1}
              color_bg={statusInfo.color_bg}
              color_text={statusInfo.color_text}
              color_boder={statusInfo.color_boder}
            />
          );
        })}
      </div>
    </div>
  );

};



// Cập nhật component Step với hiệu ứng đẹp hơn
const Step: React.FC<StepProps> = ({
  // status,
  // step,
  title,
  description,
  icon,
  isLast = false,
  color_bg,
  color_text,
  color_boder,

}) => {
  // const isActive = getStepValue(status) >= getStepValue(step);
  // const isCurrentStep = status === step;

  return (
    <div className={cn(
      "flex flex-col items-center relative"
    )}>
      {!isLast && (
        <div className={cn(
          "absolute top-7 h-[3px] w-full",
          "left-[calc(50%+38px)] right-0",
          color_bg,
          "transition-all duration-500 ease-out"
        )}></div>
      )}

      {/* Vòng tròn ngoài */}
      <div className="relative z-10">
        <div className={cn(
          "w-[90px] h-[65px] rounded-full flex items-center justify-center",
          "border-2 transition-all duration-300",
          color_boder,
          "bg-white"
        )}>
          {/* Hình ảnh phía trong */}
          <div className={cn(
            "w-[82px] h-[57px] rounded-full flex items-center justify-center",
            "transition-colors duration-300",
            color_text, color_bg
          )}>
            {icon}
          </div>
        </div>
      </div>
      {/* text phía đươi */}
      <div className="mt-3 text-center max-w-[160px]">
        <h3 className={cn(
          "text-sm font-semibold transition-colors",
          color_text
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-xs mt-1  font-medium",
          color_text
        )} >{description}</p>
      </div>
    </div>
  );
};
interface TrangThaiDonHangProps {
  trangThai: OrderStatus;
  searchBill: BillRespones | null;
  loadTongBill: () => void;
  themBillHistory: (actionType: string, note: string) => void;
}

const TrangThaiDonHangGiaoHang: React.FC<TrangThaiDonHangProps> =
  ({
    trangThai,
    searchBill,
    loadTongBill,
    themBillHistory
  }) => {

    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(trangThai);
    useEffect(() => {
      if (trangThai != null) {
        setCurrentStatus(trangThai as OrderStatus);
        // console.log("Trạng thái hiện tại:", trangThai);
      }
    }, [searchBill]);   
    const statusOrder: OrderStatus[] = [
      "CHO_XAC_NHAN",
      "DA_XAC_NHAN",
      "DANG_CHUAN_BI_HANG",
      "DANG_GIAO_HANG",
      "HOAN_THANH"
    ];
    const handleNextStatus = async () => {

      const isMissingImei = searchBill?.billDetailResponesList.some(
        (detail) => (!detail.imeiSoldRespones || detail.imeiSoldRespones.length === 0)
          && detail.quantity > 0
      );

      if (isMissingImei) {
        showErrorToast("Vui lòng cập nhập imei cho tất cả sản phẩm");
        return;
      }

      if (!note?.trim()) {
        showErrorToast("Vui lòng nhập ghi chú");
        return;
      }

      if (!searchBill) return;

      const currentIndex = statusOrder.indexOf(currentStatus);
      if (currentIndex < statusOrder.length - 1) {
        const nextStatus = statusOrder[currentIndex + 1];

        // Nếu chuyển từ "ĐANG_GIAO_HANG" sang "HOÀN THÀNH", cập nhật hóa đơn
        if (nextStatus === "HOAN_THANH") {
          try {
            const amountChange = searchBill?.amountChange ?? 0;
            const totalDue = searchBill?.totalDue ?? 0;
            const customerPayment = searchBill?.customerPayment ?? 0;

            const result = amountChange < 0
              ? Math.abs(totalDue)
              : (totalDue - customerPayment + amountChange);

            // Cộng thêm phần payment vào kết quả
            const finalAmount = result + customerPayment;
            await updateTotalDue(searchBill?.id ?? 0, finalAmount)
            // loadTongBill();
            // showSuccessToast("Cập nhật hóa đơn thành công!");
          } catch (error) {
            showErrorToast("Có lỗi xảy ra khi cập nhật hóa đơn.");
            console.error("Error updating bill:", error);
            return;
          }
        }

        // Cập nhật trạng thái tiếp theo
        setCurrentStatus(nextStatus);
        await updateStatus(searchBill?.id, nextStatus);
        themBillHistory(nextStatus, note);
        setOpen(false);
        setNote("");
        showSuccessToast("Cập nhật trạng thái đơn hàng thành công.");
        loadTongBill();
      }

    };

    const handleCancel = async () => {
      if (!note?.trim()) {
        showErrorToast("Vui lòng nhập ghi chú.");
        return;
      }

      if (!searchBill) return;

      setCurrentStatus("DA_HUY");
      await updateStatus(searchBill.id, "DA_HUY");
      themBillHistory("DA_HUY", note);
      setOpen(false);
      await huyHoaDon(searchBill?.id, note);
      showSuccessToast("Đã hủy đơn hàng thành công.");
      loadTongBill();
    };

    const getNextStatus = (): string | null => {
      const currentIndex = statusOrder.indexOf(currentStatus);
      if (currentIndex < statusOrder.length - 1) {
        return statusOrder[currentIndex + 1];
      }
      return null;
    };

    const printRef = useRef<HTMLDivElement>(null)
    const [printData, setPrintData] = useState<any>(null)


    const handlePrint = (invoiceData: any) => {
      setPrintData(invoiceData)

      // Đợi React cập nhật DOM trước khi in
      setTimeout(() => {
        const printElement = printRef.current
        if (printElement) {
          const printWindow = window.open('', '_blank')
          if (printWindow) {
            printWindow.document.write(`
                    <html>
                      <head>
                        <title>In hóa đơn</title>
                        <link rel="stylesheet" href="/path-to-your-tailwind.css">
                      </head>
                      <body onload="window.print()">
                        ${printElement.innerHTML}
                      </body>
                    </html>
                  `)
            printWindow.document.close()
          }
        }
      }, 100)
    }
    const invoiceData = {
      id: searchBill?.id,
      code: searchBill?.maBill,
      paymentDate: searchBill?.paymentDate,
      staff: searchBill?.fullNameNV,
      customer: searchBill?.name,
      phone: searchBill?.phone,
      items: searchBill?.billDetailResponesList.map(detail => ({
        product: detail.productDetail.productName + ' ' +
          detail.productDetail.ram + '/' +
          detail.productDetail.rom + 'GB ( ' +
          detail.productDetail.color + ' )',
        imei: detail.imeiSoldRespones.map(imeiSold => imeiSold.id_Imei.imeiCode),
        price: detail.price,
        quantity: detail.quantity,
      })) || [],
      totalPrice: searchBill?.totalPrice || 0,
      deliveryFee: searchBill?.deliveryFee || 0,
      discountedTotal: searchBill?.discountedTotal || 0,
      customerPayment: searchBill?.customerPayment || 0,
      change: searchBill?.amountChange || 0,
    };
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"confirm" | "cancel" | null>(null);
    const [note, setNote] = useState("");

    const handleOpenDialog = (type: "confirm" | "cancel") => {
      setDialogType(type);
      setOpen(true);
      // console.log(currentStatus + "dsddz")
    };

    return (
      <div className="w-full">
        <div className="bg-white rounded-xl ring-1 ring-gray-200 shadow-xl p-4">
          {/* Header */}
          <div className="p-2 border-b border-gray-100 ml-[10px]">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
              <span className="text-sm text-black font-medium">Mã đơn hàng: {searchBill != null ? searchBill.maBill : ""}</span>
            </div>
          </div>

          <div className="p-4 w-full">
            <div className="overflow-x-auto">
              <OrderStepper
                searchBill={searchBill}
                currentStatus={currentStatus}
              />
            </div>

            <div className="flex justify-center gap-4 mt-8">

              <Button
                onClick={() => handleOpenDialog("confirm")}
                disabled={
                  currentStatus === "CHO_THANH_TOAN"
                  || currentStatus === "HOAN_THANH"
                  || currentStatus === "DA_HUY"
                }
                className={cn(
                  "px-4 py-2 rounded-md text-white transition-all duration-300",
                  "flex items-center gap-2 bg-orange-500 hover:bg-orange-600 ml-[10px]"
                )}
              >
                {getNextStatus() ? `${statusMap[getNextStatus()!]?.title}` : "Xác nhận"}
              </Button>

              {/* Nút Hủy đơn */}
              <Button
                onClick={() => handleOpenDialog("cancel")}
                disabled={
                  currentStatus === "DANG_GIAO_HANG"
                  || currentStatus === "HOAN_THANH"
                  || currentStatus === "CHO_THANH_TOAN"
                  || currentStatus === "DA_HUY"
                }
                className={cn(
                  "px-4 py-2 rounded-md text-white transition-all duration-300",
                  "flex items-center gap-2 bg-red-600 hover:bg-red-500"
                )}
              >
                Hủy đơn
              </Button>

              <div className="ml-[480px]">
                <Button
                  disabled={
                    currentStatus === "CHO_THANH_TOAN"
                    || currentStatus === "DA_HUY"
                  }
                  onClick={() => handlePrint(invoiceData)}>
                  In hóa đơn
                </Button>
              </div>
              <ChiTiet
                searchBill={searchBill} />
            </div>
          </div>
          <div style={{ position: 'fixed', left: '-9999px' }}>
            {printData && (
              <div ref={printRef} className="invoice-container">
                <InvoiceTemplate billData={printData} />
              </div>
            )}
          </div>
        </div>
        <ToastContainer />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dialogType === "cancel"
                  ? "Hủy đơn hàng"
                  : (getNextStatus()
                    ? `${statusMap[getNextStatus()!]?.title} đơn hàng`
                    : "Xác nhận")}
              </DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <Textarea
                placeholder="Ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false)
                  setNote("")
                }
                }
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={dialogType === "confirm" ? handleNextStatus : handleCancel}
                className={dialogType === "confirm"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"}
              >
                {dialogType === "confirm" ? "Xác nhận" : "Xác nhận"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>

    );
  }

export default TrangThaiDonHangGiaoHang;


