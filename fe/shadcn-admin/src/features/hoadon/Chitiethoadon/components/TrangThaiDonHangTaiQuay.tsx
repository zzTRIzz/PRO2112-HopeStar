import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Package, Truck, CreditCard } from "lucide-react";
import { BillRespones } from "@/features/banhang/service/Schema";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react'
interface StepProps {
    status: OrderStatusTaiQuay;
    step: OrderStatusTaiQuay;
    title: string;
    description: string;
    icon: React.ReactNode;
    isLast?: boolean;
}

export type OrderStatusTaiQuay =
    | "CHO_THANH_TOAN"
    | "HOAN_THANH"
    | "DA_HUY"
    ;

interface OrderStepperProps {
    currentStatus: OrderStatusTaiQuay;
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

function getStepValue(status: OrderStatusTaiQuay): number {
    const statusMap: Record<OrderStatusTaiQuay, number> = {
        CHO_THANH_TOAN: 1,
        HOAN_THANH: 2,
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
                        step="CHO_THANH_TOAN"
                        title="Chờ thanh toán đơn hàng "
                        description="Đang chờ mua hàng"
                        icon={<CreditCard className="w-4 h-4" />}
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
    trangThai: OrderStatusTaiQuay;
    searchBill: BillRespones | null;
    loadTongBill: () => void;
    findBillById: (id: number) => void;
}
const TrangThaiDonHangTaiQuay: React.FC<TrangThaiDonHangProps> =
    ({
        trangThai,
        searchBill,
        loadTongBill
    }) => {

        const [currentStatus, setCurrentStatus] = useState<OrderStatusTaiQuay>(trangThai);

        // Mảng các trạng thái theo thứ tự
        const statusOrder: OrderStatusTaiQuay[] = [
            "CHO_THANH_TOAN",
            "HOAN_THANH"
        ];
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

                    {/* Stepper */}
                    <div className="p-6 ">
                        <OrderStepper currentStatus={currentStatus} />

                        {currentStatus !== "DA_HUY" && (
                            < div className="flex justify-center gap-4 mt-8">
                                <Button disabled
                                    className={cn(
                                        "px-4 py-2 rounded-md text-white transition-all duration-300",
                                        "flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                                    )}>
                                    Xác nhận
                                </Button>
                                <Button
                                    disabled
                                    className={cn(
                                        "px-4 py-2 rounded-md text-white transition-all duration-300",
                                        "flex items-center gap-2",
                                        // currentStatus === "CHO_XAC_NHAN"
                                        //     ? "bg-gray-300 cursor-not-allowed" :
                                        "bg-red-600 hover:bg-red-500"
                                    )}>
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
            </div >
        );
    }

export default TrangThaiDonHangTaiQuay;