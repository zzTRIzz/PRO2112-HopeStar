// // // TrangThaiDonHang.tsx
// import React, { useState } from "react";
// import { cn } from "@/lib/utils";
// import { CheckCircle, Clock, Package, Truck, CreditCard } from "lucide-react";
// import { BillSchema } from "@/features/banhang/service/Schema";
// import { updateStatus } from "../../service/HoaDonService";
// import { Button } from "@/components/ui/button";

// type OrderStatus =
//     | "CHO_XAC_NHAN"
//     | "DANG_CHUAN_BI_HANG"
//     | "DANG_GIAO_HANG"
//     | "DA_GIAO_HANG"
//     | "HOAN_THANH"
//     | "CHO_THANH_TOAN"
//     // | "DA_THANH_TOAN"
//     // | "DA_HUY"
//     ;

// interface TrangThaiDonHangProps {
//     searchBill: BillSchema | null;
//     loadTongBill: () => void;
//     findBillById: (id: number) => void;
// }

// // const TrangThaiDonHang: React.FC<TrangThaiDonHangProps> = ({
// //   searchBill,
// //   loadTongBill,
// //   findBillById
// // }) => {
// //   const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
// //     searchBill?.status as OrderStatus
// //   );

// //   // Config theo loại hóa đơn
// //   const isGiaoHang = searchBill?.billType === 1;

// //   // Cấu hình stepper
// //   const statusConfig = {
// //     steps: isGiaoHang ? [
// //       { step: "CHO_XAC_NHAN", title: "Đặt hàng thành công", description: "Đang chờ xác nhận", icon: <CreditCard className="w-4 h-4" /> },
// //       { step: "DANG_CHUAN_BI_HANG", title: "Đang chuẩn bị hàng", description: "Đơn hàng đang xử lý", icon: <Clock className="w-4 h-4" /> },
// //       { step: "DANG_GIAO_HANG", title: "Đang vận chuyển", description: "Đơn hàng đang giao", icon: <Truck className="w-4 h-4" /> },
// //       { step: "DA_GIAO_HANG", title: "Đã giao hàng", description: "Đơn hàng đã giao", icon: <Package className="w-4 h-4" /> },
// //       { step: "HOAN_THANH", title: "Hoàn thành", description: "Đơn hàng hoàn tất", icon: <CheckCircle className="w-4 h-4" /> }
// //     ] : [
// //       { step: "CHO_THANH_TOAN", title: "Chờ thanh toán", description: "Đang chờ mua hàng", icon: <CreditCard className="w-4 h-4" /> },
// //       { step: "DA_THANH_TOAN", title: "Hoàn thành", description: "Đơn hàng hoàn tất", icon: <CheckCircle className="w-4 h-4" /> }
// //     ],

// //     statusOrder: isGiaoHang ? [
// //       "CHO_XAC_NHAN",
// //       "DANG_CHUAN_BI_HANG",
// //       "DANG_GIAO_HANG",
// //       "DA_GIAO_HANG",
// //       "HOAN_THANH"
// //     ] : [
// //       "CHO_THANH_TOAN",
// //       "DA_THANH_TOAN"
// //     ]
// //   };

// //   const handleNextStatus = async () => {
// //     const currentIndex = statusConfig.statusOrder.indexOf(currentStatus);
// //     if (currentIndex < statusConfig.statusOrder.length - 1) {
// //       const newStatus = statusConfig.statusOrder[currentIndex + 1];
// //       setCurrentStatus(newStatus);

// //       if (searchBill) {
// //         await updateStatus(searchBill.id, newStatus);
// //         loadTongBill();
// //       }
// //     }
// //   };

// //   const handlePrevStatus = () => {
// //     const currentIndex = statusConfig.statusOrder.indexOf(currentStatus);
// //     if (currentIndex > 0) {
// //       setCurrentStatus(statusConfig.statusOrder[currentIndex - 1]);
// //     }
// //   };

// //   const Step = ({ step, title, description, icon, isLast = false }) => {
// //     const isActive = statusConfig.statusOrder.indexOf(currentStatus) >= statusConfig.statusOrder.indexOf(step);
// //     const isCurrentStep = currentStatus === step;

// //     return (
// //       <div className={cn("flex flex-col items-center relative", !isLast ? "flex-1" : "flex-1")}>
// //         {/* ... Giữ nguyên phần UI của Step ... */}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="w-[985px]">
// //       <div className="bg-white rounded-xl ring-1 ring-gray-200 shadow-xl p-4">
// //         {/* Header */}
// //         <div className="p-2 border-b border-gray-100 ml-[10px]">
// //           <div className="flex justify-between items-center">
// //             <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
// //             <span className="text-sm text-black font-medium">
// //               Mã đơn hàng: {searchBill?.nameBill || ""}
// //             </span>
// //           </div>
// //         </div>

// //         {/* Stepper */}
// //         <div className="p-6">
// //           <div className={cn("w-full flex items-start justify-between gap-2 px-4")}>
// //             {statusConfig.steps.map((step, index) => (
// //               <Step
// //                 key={step.step}
// //                 step={step.step}
// //                 title={step.title}
// //                 description={step.description}
// //                 icon={step.icon}
// //                 isLast={index === statusConfig.steps.length - 1}
// //               />
// //             ))}
// //           </div>

// //           {/* Buttons */}
// //           <div className="flex justify-center gap-4 mt-8">
// //             {isGiaoHang ? (
// //               <>
// //                 {currentStatus !== "HOAN_THANH" && (
// //                   <Button onClick={handleNextStatus} className="bg-orange-500 hover:bg-orange-600">
// //                     Xác nhận
// //                   </Button>
// //                 )}
// //                 {(currentStatus === "CHO_XAC_NHAN" || currentStatus === "DANG_CHUAN_BI_HANG") && (
// //                   <Button onClick={handlePrevStatus} className="bg-red-600 hover:bg-red-500">
// //                     Hủy đơn
// //                   </Button>
// //                 )}
// //               </>
// //             ) : (
// //               currentStatus === "CHO_THANH_TOAN" && (
// //                 <Button onClick={handleNextStatus} className="bg-orange-500 hover:bg-orange-600">
// //                   Thanh toán
// //                 </Button>
// //               )
// //             )}

// //             <div className={isGiaoHang ? "ml-[500px]" : "ml-[700px]"}>
// //               <Button className="bg-blue-500 hover:bg-blue-600">
// //                 In hóa đơn
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TrangThaiDonHang;




// const TrangThaiDonHang: React.FC<TrangThaiDonHangProps> = ({
//     searchBill,
//     loadTongBill,
//     findBillById,
// }) => {
//     const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
//         searchBill?.status as OrderStatus
//     );

//     // Cấu hình trạng thái và bước
//     const statusConfig = {
//         CHO_XAC_NHAN: {
//             title: "Đặt hàng thành công",
//             description: "Đang chờ xác nhận",
//             icon: <CreditCard className="w-4 h-4" />,
//             next: "DANG_CHUAN_BI_HANG",
//             prev: null,
//         },
//         DANG_CHUAN_BI_HANG: {
//             title: "Đang chuẩn bị hàng",
//             description: "Đơn hàng đang xử lý",
//             icon: <Clock className="w-4 h-4" />,
//             next: "DANG_GIAO_HANG",
//             prev: "CHO_XAC_NHAN",
//         },
//         DANG_GIAO_HANG: {
//             title: "Đang vận chuyển",
//             description: "Đơn hàng đang giao",
//             icon: <Truck className="w-4 h-4" />,
//             next: "DA_GIAO_HANG",
//             prev: "DANG_CHUAN_BI_HANG",
//         },
//         DA_GIAO_HANG: {
//             title: "Đã giao hàng",
//             description: "Đơn hàng đã giao",
//             icon: <Package className="w-4 h-4" />,
//             next: "HOAN_THANH",
//             prev: "DANG_GIAO_HANG",
//         },
//         HOAN_THANH: {
//             title: "Hoàn thành",
//             description: "Đơn hàng hoàn tất",
//             icon: <CheckCircle className="w-4 h-4" />,
//             next: null,
//             prev: "DA_GIAO_HANG",
//         },
//         CHO_THANH_TOAN: {
//             title: "Chờ thanh toán",
//             description: "Đang chờ mua hàng",
//             icon: <CreditCard className="w-4 h-4" />,
//             next: "HOAN_THANH",
//             prev: null,
//         },
//         DA_THANH_TOAN: {
//             title: "Hoàn thành",
//             description: "Đơn hàng hoàn tất",
//             icon: <CheckCircle className="w-4 h-4" />,
//             next: null,
//             prev: "CHO_THANH_TOAN",
//         },
//     };

//     // Lấy danh sách các bước dựa trên loại hóa đơn
//     const steps = searchBill?.billType === 1
//         ? ["CHO_XAC_NHAN", "DANG_CHUAN_BI_HANG", "DANG_GIAO_HANG", "DA_GIAO_HANG", "HOAN_THANH"]
//         : ["CHO_THANH_TOAN", "HOAN_THANH"];

//     const handleNextStatus = async () => {
//         const nextStatus = statusConfig[currentStatus]?.next;
//         if (nextStatus) {
//             setCurrentStatus(nextStatus);

//             if (searchBill) {
//                 await updateStatus(searchBill.id, nextStatus);
//                 loadTongBill();
//             }
//         }
//     };

//     const handlePrevStatus = async () => {
//         const prevStatus = statusConfig[currentStatus]?.prev;
//         if (prevStatus) {
//             setCurrentStatus(prevStatus);

//             if (searchBill) {
//                 await updateStatus(searchBill.id, prevStatus);
//                 loadTongBill();
//             }
//         }
//     };

//     const Step = ({ step, isLast }: { step: string; isLast: boolean }) => {
//         const isActive = steps.indexOf(currentStatus) >= steps.indexOf(step);
//         const isCurrentStep = currentStatus === step;

//         return (
//             <div className={cn("flex flex-col items-center relative", !isLast ? "flex-1" : "flex-1")}>
//                 <div
//                     className={cn(
//                         "flex items-center justify-center w-8 h-8 rounded-full",
//                         isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
//                     )}
//                 >
//                     {statusConfig[step].icon}
//                 </div>
//                 <div className="mt-2 text-center">
//                     <p className={cn("text-sm font-medium", isCurrentStep ? "text-blue-500" : "text-gray-500")}>
//                         {statusConfig[step].title}
//                     </p>
//                     <p className="text-xs text-gray-400">{statusConfig[step].description}</p>
//                 </div>
//                 {!isLast && (
//                     <div
//                         className={cn(
//                             "absolute top-4 left-1/2 w-full h-0.5 transform -translate-x-1/2",
//                             isActive ? "bg-blue-500" : "bg-gray-200"
//                         )}
//                     />
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className="w-[985px]">
//             <div className="bg-white rounded-xl ring-1 ring-gray-200 shadow-xl p-4">
//                 {/* Header */}
//                 <div className="p-2 border-b border-gray-100 ml-[10px]">
//                     <div className="flex justify-between items-center">
//                         <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
//                         <span className="text-sm text-black font-medium">
//                             Mã đơn hàng: {searchBill?.nameBill || ""}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Stepper */}
//                 <div className="p-6">
//                     <div className={cn("w-full flex items-start justify-between gap-2 px-4")}>
//                         {steps.map((step, index) => (
//                             <Step
//                                 key={step}
//                                 step={step}
//                                 isLast={index === steps.length - 1}
//                             />
//                         ))}
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex justify-center gap-4 mt-8">
//                         {currentStatus !== "HOAN_THANH" && (
//                             <Button onClick={handleNextStatus} className="bg-orange-500 hover:bg-orange-600">
//                                 {searchBill?.billType === 1 ? "Xác nhận" : "Thanh toán"}
//                             </Button>
//                         )}
//                         {["CHO_XAC_NHAN", "DANG_CHUAN_BI_HANG"].includes(currentStatus) && (
//                             <Button onClick={handlePrevStatus} className="bg-red-600 hover:bg-red-500">
//                                 Hủy đơn
//                             </Button>
//                         )}
//                         <div className={searchBill?.billType === 1 ? "ml-[500px]" : "ml-[700px]"}>
//                             <Button className="bg-blue-500 hover:bg-blue-600">
//                                 In hóa đơn
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TrangThaiDonHang;



import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Package, Truck, CreditCard } from "lucide-react";
import { BillSchema } from "@/features/banhang/service/Schema";
import { updateStatus } from "../../service/HoaDonService";
import { Button } from "@/components/ui/button";

type OrderStatus =
  | "CHO_XAC_NHAN"
  | "DANG_CHUAN_BI_HANG"
  | "DANG_GIAO_HANG"
  | "DA_GIAO_HANG"
  | "HOAN_THANH"
  | "CHO_THANH_TOAN"
  | "DA_THANH_TOAN";

interface TrangThaiDonHangProps {
  searchBill: BillSchema | null;
  loadTongBill: () => void;
}

interface StatusConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  next: OrderStatus | null;
  prev: OrderStatus | null;
}

const TrangThaiDonHang: React.FC<TrangThaiDonHangProps> = ({
  searchBill,
  loadTongBill
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
    (searchBill?.status as OrderStatus) || 
    (searchBill?.billType === 1 ? "CHO_XAC_NHAN" : "CHO_THANH_TOAN")
  );

  const statusConfig: Record<OrderStatus, StatusConfig> = {
    CHO_XAC_NHAN: {
      title: "Đặt hàng thành công",
      description: "Đang chờ xác nhận",
      icon: <CreditCard className="w-4 h-4" />,
      next: "DANG_CHUAN_BI_HANG",
      prev: null,
    },
    DANG_CHUAN_BI_HANG: {
      title: "Đang chuẩn bị hàng",
      description: "Đơn hàng đang xử lý",
      icon: <Clock className="w-4 h-4" />,
      next: "DANG_GIAO_HANG",
      prev: "CHO_XAC_NHAN",
    },
    DANG_GIAO_HANG: {
      title: "Đang vận chuyển",
      description: "Đơn hàng đang giao",
      icon: <Truck className="w-4 h-4" />,
      next: "DA_GIAO_HANG",
      prev: "DANG_CHUAN_BI_HANG",
    },
    DA_GIAO_HANG: {
      title: "Đã giao hàng",
      description: "Đơn hàng đã giao",
      icon: <Package className="w-4 h-4" />,
      next: "HOAN_THANH",
      prev: "DANG_GIAO_HANG",
    },
    HOAN_THANH: {
      title: "Hoàn thành",
      description: "Đơn hàng hoàn tất",
      icon: <CheckCircle className="w-4 h-4" />,
      next: null,
      prev: "DA_GIAO_HANG",
    },
    CHO_THANH_TOAN: {
      title: "Chờ thanh toán",
      description: "Đang chờ mua hàng",
      icon: <CreditCard className="w-4 h-4" />,
      next: "DA_THANH_TOAN",
      prev: null,
    },
    DA_THANH_TOAN: {
      title: "Hoàn thành",
      description: "Đơn hàng hoàn tất",
      icon: <CheckCircle className="w-4 h-4" />,
      next: null,
      prev: "CHO_THANH_TOAN",
    },
  };

  const steps: OrderStatus[] = searchBill?.billType === 1
    ? ["CHO_XAC_NHAN", "DANG_CHUAN_BI_HANG", "DANG_GIAO_HANG", "DA_GIAO_HANG", "HOAN_THANH"]
    : ["CHO_THANH_TOAN", "DA_THANH_TOAN"];

  const handleNextStatus = async () => {
    const nextStatus = statusConfig[currentStatus].next;
    if (nextStatus) {
      setCurrentStatus(nextStatus);
      if (searchBill) {
        await updateStatus(searchBill.id, nextStatus);
        loadTongBill();
      }
    }
  };

  const handlePrevStatus = async () => {
    const prevStatus = statusConfig[currentStatus].prev;
    if (prevStatus) {
      setCurrentStatus(prevStatus);
      if (searchBill) {
        await updateStatus(searchBill.id, prevStatus);
        loadTongBill();
      }
    }
  };

  const Step = ({ step, isLast }: { step: OrderStatus; isLast: boolean }) => {
    const isActive = steps.indexOf(currentStatus) >= steps.indexOf(step);
    const isCurrentStep = currentStatus === step;

    return (
      <div className={cn("flex flex-col items-center relative", !isLast ? "flex-1" : "flex-1")}>
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
          )}
        >
          {statusConfig[step].icon}
        </div>
        <div className="mt-2 text-center">
          <p className={cn("text-sm font-medium", isCurrentStep ? "text-blue-500" : "text-gray-500")}>
            {statusConfig[step].title}
          </p>
          <p className="text-xs text-gray-400">{statusConfig[step].description}</p>
        </div>
        {!isLast && (
          <div
            className={cn(
              "absolute top-4 left-1/2 w-full h-0.5 transform -translate-x-1/2",
              isActive ? "bg-blue-500" : "bg-gray-200"
            )}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-[985px]">
      <div className="bg-white rounded-xl ring-1 ring-gray-200 shadow-xl p-4">
        <div className="p-2 border-b border-gray-100 ml-[10px]">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
            <span className="text-sm text-black font-medium">
              Mã đơn hàng: {searchBill?.nameBill || ""}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className={cn("w-full flex items-start justify-between gap-2 px-4")}>
            {steps.map((step, index) => (
              <Step
                key={step}
                step={step}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {statusConfig[currentStatus].next && (
              <Button onClick={handleNextStatus} className="bg-orange-500 hover:bg-orange-600">
                {searchBill?.billType === 1 ? "Xác nhận" : "Thanh toán"}
              </Button>
            )}
            
            {statusConfig[currentStatus].prev && (
              <Button onClick={handlePrevStatus} className="bg-red-600 hover:bg-red-500">
                Hủy đơn
              </Button>
            )}

            <div className={searchBill?.billType === 1 ? "ml-[500px]" : "ml-[700px]"}>
              <Button className="bg-blue-500 hover:bg-blue-600">
                In hóa đơn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangThaiDonHang;