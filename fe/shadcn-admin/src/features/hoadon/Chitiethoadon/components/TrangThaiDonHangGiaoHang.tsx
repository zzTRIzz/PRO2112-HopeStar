import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Package, Truck, CreditCard } from "lucide-react";
import { BillRespones, BillSchema } from "@/features/banhang/service/Schema";
import { updateStatus } from "../../service/HoaDonService";
import { Button } from "@/components/ui/button";
import { fromThatBai, fromThanhCong } from "../../../banhang/components/ThongBao";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from '@iconify/react'

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

            {/* Icon với vòng tròn */}
            <div className={cn(
                "relative z-10 p-1", // Thêm padding cho vòng tròn ngoài
                "rounded-full", // Bo tròn vòng ngoài
                "border-2", // Thêm border cho vòng tròn
                isActive
                    ? "border-green-500"
                    : "border-gray-200",
                "transition-colors duration-300",
                "bg-white" // Nền trắng để che đường nối
            )}>
                <div className={cn(
                    "w-8 h-8 rounded-full", // Giảm kích thước icon container
                    "flex items-center justify-center",
                    isActive ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
                    "transition-all duration-300 ease-in-out"
                )}>
                    {icon}
                </div>
            </div>

            {/* Text */}
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
            // Kiểm tra xem có bất kỳ chi tiết sản phẩm nào thiếu imei hay không
            const isMissingImei = searchBill?.billDetailResponesList.some(detail =>
                !detail.imeiSoldRespones || detail.imeiSoldRespones.length === 0
            );

            if (isMissingImei) {
                fromThatBai("Một số sản phẩm chưa có IMEI.");
                console.error("Một số sản phẩm chưa có IMEI.");
                return;
            }

            const currentIndex = statusOrder.indexOf(currentStatus);
            if (currentIndex < statusOrder.length - 1) {
                setCurrentStatus(statusOrder[currentIndex + 1]);
            }
            if (searchBill != null) {
                await updateStatus(searchBill?.id, statusOrder[currentIndex + 1]);
                loadTongBill();
                console.log(statusOrder[currentIndex + 1]);
            }
            fromThanhCong("Cập nhật trạng thái đơn hàng thành công.");
        };

        const handlePrevStatus = async () => {
            // const currentIndex = statusOrder.indexOf(currentStatus);
            // console.log(currentIndex);
            setCurrentStatus("DA_HUY");
            if (searchBill != null) {
                await updateStatus(searchBill?.id, "DA_HUY");
                loadTongBill();
            }
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
                                    <Button>
                                        In hóa đơn
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored" />
            </div>

        );
    }

export default TrangThaiDonHangGiaoHang;