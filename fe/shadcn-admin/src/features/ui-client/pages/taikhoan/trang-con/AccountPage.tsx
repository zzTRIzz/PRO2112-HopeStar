import React from 'react';
import { Input, Button } from '@heroui/react';

export const AccountPage = () => {


  const [formData, setFormData] = React.useState({
    // fullName: 'Clone 0',
    // email: 'nqt200415@gmail.com',
    // phone: ''
    fullName: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile') || '{}').name : 'Clone 0',
    email: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile') || '{}').email: 'qt200415@gmail.com',
    phone: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile') || '{}').phone: '0123456789',
  });

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">Thông tin tài khoản</h1>
      
      <div className="space-y-6">
        <Input
          label="Họ và tên"
          value={formData.fullName}
          onValueChange={handleChange('fullName')}
          variant="bordered"
        />

        <Input
          label="Email"
          value={formData.email}
          onValueChange={handleChange('email')}
          variant="bordered"
        />

        <Input
          label="Số điện thoại"
          value={formData.phone}
          onValueChange={handleChange('phone')}
          variant="bordered"
        />

        <Button
          color="primary"
          className="mt-8"
        >
          Đổi mật khẩu
        </Button>
      </div>
    </div>
  );
};
