import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Truck, CreditCard } from "lucide-react";
import { BillRespones } from "@/features/banhang/service/Schema";
import { updateStatus } from "../../service/HoaDonService";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react'
import { showErrorToast, showSuccessToast } from "./components_con/ThongBao";
import { updateTotalDue } from "../../service/HoaDonService";
import { ToastContainer } from "react-toastify";
import InvoiceTemplate from "./components_con/InHoaDon";
import ChiTiet from "./components_con/ChiTiet";

interface StepProps {
    status: OrderStatus;
    step: OrderStatus;
    title: string;
    description: string;
    icon: React.ReactNode;
    isLast?: boolean;
}

export type OrderStatus =
    | "CHO_XAC_NHAN"
    | "DA_XAC_NHAN"
    | "DANG_CHUAN_BI_HANG"
    | "DANG_GIAO_HANG"
    | "HOAN_THANH"
    | "DA_HUY"
    ;

interface OrderStepperProps {
    currentStatus: OrderStatus;
    className?: string;
}

const Step: React.FC<StepProps> = ({
    status,
    step,
    title,
    description,
    icon,
    isLast = false
}) => {
    const isActive = getStepValue(status) >= getStepValue(step);
    const isCurrentStep = status === step;

    return (
        <div className={cn(
            "flex flex-col items-center relative",
            !isLast ? "flex-1" : "flex-1"
        )}>
            {/* Đường nối */}
            {!isLast && (
                <div className={cn(
                    "absolute top-5 h-0.5",
                    "left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)]", // Điều chỉnh vị trí đường nối
                    isActive ? "bg-green-500" : "bg-gray-200",
                    "transition-colors duration-300"
                )}></div>
            )}


            <div className={cn(
                "relative z-10 p-1",
                "rounded-full",
                "border-2",
                isActive
                    ? "border-green-500"
                    : "border-gray-200",
                "transition-colors duration-300",
                "bg-white"
            )}>
                <div className={cn(
                    "w-8 h-8 rounded-full",
                    "flex items-center justify-center",
                    isActive ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
                    "transition-all duration-300 ease-in-out"
                )}>
                    {icon}
                </div>
            </div>

            <div className="mt-2 text-center max-w-[150px]">
                <h3 className={cn(
                    "text-sm font-medium ",
                    isCurrentStep ? "text-green-500 font-bold" : isActive ? "text-gray-900" : "text-gray-500",
                    "transition-colors duration-300"
                )}>
                    {title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    );
};

function getStepValue(status: OrderStatus): number {
    const statusMap: Record<OrderStatus, number> = {
        CHO_XAC_NHAN: 1,
        DA_XAC_NHAN: 2,
        DANG_CHUAN_BI_HANG: 3,
        DANG_GIAO_HANG: 4,
        HOAN_THANH: 5,
        DA_HUY: -1
    };

    return statusMap[status];
}
const actions = [
    {
        time: "15:45:11 - 22/01/2024",
        title: "Đặt Hàng Thành Công",
        color: "green",
        icon: "📝",
    },
    {
        time: "15:45:57 - 22/01/2024",
        title: "Cập Nhật Đơn Hàng",
        color: "yellow",
        icon: "✏️",
    },
    {
        time: "15:47:42 - 22/01/2024",
        title: "Chờ Giao Hàng",
        color: "green",
        icon: "💵",
    }
    ,
    {
        time: "15:47:42 - 22/01/2024",
        title: "Chờ Giao Hàng",
        color: "green",
        icon: "💵",
    }
];

const OrderStepper: React.FC<OrderStepperProps> = ({
    currentStatus,
    className
}) => {
    return (
        <div className={cn(
            "w-full flex items-start justify-between gap-2 px-4",
            className
        )}>
            {currentStatus === "DA_HUY" ? (
                <div className="w-full h-[130px] bg-red-100 rounded-xl flex flex-col items-center justify-center text-red-600 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:alert-circle" width={26} />
                        <span className="text-lg font-semibold">Đơn hàng đã hủy</span>
                    </div>
                </div>

            ) : (
                <>
                    <Step
                        status={currentStatus}
                        step="CHO_XAC_NHAN"
                        title="Đang chờ xác nhận"
                        description="Đặt hàng thành công"
                        icon={<CreditCard className="w-4 h-4" />}
                    />
                    <Step
                        status={currentStatus}
                        step="DA_XAC_NHAN"
                        title="Đã xác nhận"
                        description="Đơn hàng đã xác nhận"
                        icon={<CreditCard className="w-4 h-4" />}
                    />

                    <Step
                        status={currentStatus}
                        step="DANG_CHUAN_BI_HANG"
                        title="Đang chuẩn bị hàng"
                        description="Đơn hàng đang xử lý"
                        icon={<Clock className="w-4 h-4" />}
                    />

                    <Step
                        status={currentStatus}
                        step="DANG_GIAO_HANG"
                        title="Đang vận chuyển"
                        description="Đơn hàng đang giao"
                        icon={<Truck className="w-4 h-4" />}
                    />

                    <Step
                        status={currentStatus}
                        step="HOAN_THANH"
                        title="Hoàn thành"
                        description="Đơn hàng hoàn tất"
                        icon={<CheckCircle className="w-4 h-4" />}
                        isLast={true}
                    />
                    {/* <div className="timeline flex">
                        {actions.map((item, index) => (
                            <div key={index} className="step text-center mx-2">
                                <div className={`icon-circle bg-${item.color}-500 text-white p-2 rounded-full`}>
                                    {item.icon}
                                </div>
                                <div className="title font-bold mt-1">{item.title}</div>
                                <div className="time text-sm text-gray-500">{item.time}</div>
                            </div>
                        ))}
                    </div> */}
                </>
            )}
        </div>
    );
};

interface TrangThaiDonHangProps {
    trangThai: OrderStatus;
    searchBill: BillRespones | null;
    loadTongBill: () => void;
}

const TrangThaiDonHangGiaoHang: React.FC<TrangThaiDonHangProps> =
    ({
        trangThai,
        searchBill,
        loadTongBill
    }) => {

        const [currentStatus, setCurrentStatus] = useState<OrderStatus>(trangThai);

        // Mảng các trạng thái theo thứ tự
        const statusOrder: OrderStatus[] = [
            "CHO_XAC_NHAN",
            "DA_XAC_NHAN",
            "DANG_CHUAN_BI_HANG",
            "DANG_GIAO_HANG",
            "HOAN_THANH"
        ];
        const handleNextStatus = async () => {
            // Kiểm tra xem có bất kỳ chi tiết sản phẩm nào thiếu IMEI hay không
            const isMissingImei = searchBill?.billDetailResponesList.some(
                (detail) => !detail.imeiSoldRespones || detail.imeiSoldRespones.length === 0
            );

            if (isMissingImei) {
                showErrorToast("Một số sản phẩm chưa có IMEI.");
                console.error("Một số sản phẩm chưa có IMEI.");
                return;
            }

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
                        showSuccessToast("Cập nhật hóa đơn thành công!");
                        loadTongBill();
                    } catch (error) {
                        showErrorToast("Có lỗi xảy ra khi cập nhật hóa đơn.");
                        console.error("Error updating bill:", error);
                        return;
                    }
                }

                // Cập nhật trạng thái tiếp theo
                setCurrentStatus(nextStatus);

                if (searchBill != null) {
                    await updateStatus(searchBill?.id, nextStatus);
                    loadTongBill();
                    console.log(nextStatus);
                }

                showSuccessToast("Cập nhật trạng thái đơn hàng thành công.");
            }
        };

        const handlePrevStatus = async () => {
            setCurrentStatus("DA_HUY");
            if (searchBill != null) {
                await updateStatus(searchBill?.id, "DA_HUY");
                loadTongBill();
            }
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
            code: searchBill?.code,
            paymentDate: new Date().toISOString(),
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


        return (
            <div className="w-[985px]">
                <div className="bg-white rounded-xl ring-1 ring-gray-200 shadow-xl p-4">
                    {/* Header */}
                    <div className="p-2 border-b border-gray-100 ml-[10px]">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
                            <span className="text-sm text-black font-medium">Mã đơn hàng: {searchBill != null ? searchBill.code : ""}</span>
                        </div>
                    </div>

                    <div className="p-4">

                        <OrderStepper currentStatus={currentStatus} />


                        {currentStatus !== "DA_HUY" && (
                            <div className="flex justify-center gap-4 mt-8">
                                <Button
                                    onClick={handleNextStatus}
                                    disabled={currentStatus === "HOAN_THANH"}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-white transition-all duration-300",
                                        "flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                                    )}>
                                    Xác nhận
                                </Button>
                                <Button
                                    onClick={handlePrevStatus}
                                    disabled={currentStatus === "DANG_GIAO_HANG" || currentStatus === "HOAN_THANH"}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-white transition-all duration-300",
                                        "flex items-center gap-2",
                                        "bg-red-600 hover:bg-red-500"
                                    )} >
                                    Hủy đơn
                                </Button>

                                <div className="ml-[500px]">
                                    <Button onClick={() => handlePrint(invoiceData)}>
                                        In hóa đơn
                                    </Button>
                                </div>
                                <ChiTiet
                                    searchBill={searchBill} />
                            </div>
                        )}
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
            </div>

        );
    }

export default TrangThaiDonHangGiaoHang;


