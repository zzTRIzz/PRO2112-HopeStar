// src/features/taikhoan/data/schema.ts
interface TaiKhoanResponse {
    status: number;
    message: string;
    data: TaiKhoan[];
  }
  
  interface TaiKhoan {
    id: number;
    code: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    imageAvatar: string;
    idRole: {
      id: number;
      code: string;
      name: string;
    };
    gender: boolean;
    birthDate: string | null;
    status: "ACTIVE" | "INACTIVE";
  }