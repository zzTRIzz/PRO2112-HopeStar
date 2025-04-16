import { toast } from 'react-toastify';
import "../../css/custom-toast.css"
export const fromThanhCong = (message: string) => {
    toast.success(message, {
      position: "top-right",
      className: "custom-toast",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };


 export const fromThatBai = (message: string) => {
    toast.success(message, {
      position: "top-right",
      className: "custom-thatBai",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

