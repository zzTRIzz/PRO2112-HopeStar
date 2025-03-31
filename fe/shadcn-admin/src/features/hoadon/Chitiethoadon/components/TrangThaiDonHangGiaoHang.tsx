import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Package, Truck, CreditCard } from "lucide-react";
import { BillSchema } from "@/features/banhang/service/Schema";
import { updateStatus } from "../../service/HoaDonService";
import { Button } from "@/components/ui/button";

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
    | "DANG_CHUAN_BI_HANG"
    | "DANG_GIAO_HANG"
    | "DA_GIAO_HANG"
    | "HOAN_THANH"
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
                    isActive ? "bg-orange-500" : "bg-gray-200",
                    "transition-colors duration-300"
                )}></div>
            )}

            {/* Icon với vòng tròn */}
            <div className={cn(
                "relative z-10 p-1", // Thêm padding cho vòng tròn ngoài
                "rounded-full", // Bo tròn vòng ngoài
                "border-2", // Thêm border cho vòng tròn
                isActive
                    ? "border-orange-500"
                    : "border-gray-200",
                "transition-colors duration-300",
                "bg-white" // Nền trắng để che đường nối
            )}>
                <div className={cn(
                    "w-8 h-8 rounded-full", // Giảm kích thước icon container
                    "flex items-center justify-center",
                    isActive ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500",
                    "transition-all duration-300 ease-in-out"
                )}>
                    {icon}
                </div>
            </div>

            {/* Text */}
            <div className="mt-2 text-center max-w-[150px]">
                <h3 className={cn(
                    "text-sm font-medium ",
                    isCurrentStep ? "text-orange-500 font-bold" : isActive ? "text-gray-900" : "text-gray-500",
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
        DANG_CHUAN_BI_HANG: 2,
        DANG_GIAO_HANG: 3,
        DA_GIAO_HANG: 4,
        HOAN_THANH: 5
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
            <Step
                status={currentStatus}
                step="CHO_XAC_NHAN"
                title="Đặt hàng thành công"
                description="Đang chờ xác nhận"
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
                step="DA_GIAO_HANG"
                title="Đã giao hàng"
                description="Đơn hàng đã giao"
                icon={<Package className="w-4 h-4" />}
            />

            <Step
                status={currentStatus}
                step="HOAN_THANH"
                title="Hoàn thành"
                description="Đơn hàng hoàn tất"
                icon={<CheckCircle className="w-4 h-4" />}
                isLast={true}
            />
        </div>
    );
};

interface TrangThaiDonHangProps {
    trangThai: OrderStatus;
    searchBill: BillSchema | null;
    loadTongBill: () => void;
    findBillById: (id: number) => void;
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
            "DANG_CHUAN_BI_HANG",
            "DANG_GIAO_HANG",
            "DA_GIAO_HANG",
            "HOAN_THANH"
        ];

        const handleNextStatus = async () => {
            const currentIndex = statusOrder.indexOf(currentStatus);
            if (currentIndex < statusOrder.length - 1) {
                setCurrentStatus(statusOrder[currentIndex + 1]);
            }
            if (searchBill != null) {
                await updateStatus(searchBill?.id, statusOrder[currentIndex + 1]);
                loadTongBill();
                console.log(statusOrder[currentIndex + 1]);
            }
        };

        const handlePrevStatus = () => {
            const currentIndex = statusOrder.indexOf(currentStatus);
            if (currentIndex > 0) {
                setCurrentStatus(statusOrder[currentIndex - 1]);
            }
        };
        return (
            <div className="w-[985px]">
                <div className="bg-white rounded-xl ring-1 ring-gray-200 shadow-xl p-4">
                    {/* Header */}
                    <div className="p-2 border-b border-gray-100 ml-[10px]">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
                            <span className="text-sm text-black font-medium">Mã đơn hàng: {searchBill != null ? searchBill.nameBill : ""}</span>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="p-6 ">
                        <OrderStepper currentStatus={currentStatus} />
                        {/* Buttons */}
                        <div className="flex justify-center gap-4 mt-8">
                            {(currentStatus == "CHO_XAC_NHAN" || currentStatus == "DANG_CHUAN_BI_HANG") && (
                                <button
                                    onClick={handlePrevStatus}
                                    // disabled={currentStatus === "CHO_XAC_NHAN"}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-white transition-all duration-300",
                                        "flex items-center gap-2",
                                        // currentStatus === "CHO_XAC_NHAN"
                                        //     ? "bg-gray-300 cursor-not-allowed" :
                                        "bg-orange-500 hover:bg-orange-600"
                                    )}
                                >
                                    Hủy
                                </button>
                            )}
                            {currentStatus != "HOAN_THANH" && (
                                <button
                                    onClick={handleNextStatus}
                                    // disabled={currentStatus === "HOAN_THANH"}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-white transition-all duration-300",
                                        "flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                                    )}
                                >
                                    Xác nhận
                                </button>
                            )}
                            <div>
                                <Button>In hóa đơn </Button>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        );
    }

export default TrangThaiDonHangGiaoHang;