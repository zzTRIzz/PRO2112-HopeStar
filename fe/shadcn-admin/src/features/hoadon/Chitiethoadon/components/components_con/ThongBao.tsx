
import { toast } from "react-toastify";
import "../../../../banhang/css/custom-toast.css"
export const showSuccessToast = (message: string) => {
    toast.dismiss(); 
    toast.success(message, {
        position: "top-right",
        className: "custom-toast",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};


export const showErrorToast = (message: string) => {
    toast.dismiss();
    toast.success(message, {
        position: "top-right",
        className: "custom-thatBai", // Áp dụng CSS tùy chỉnh
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};