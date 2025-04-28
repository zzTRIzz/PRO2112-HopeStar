import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const router = useRouter();
  
  const menuItems = [
    {
      icon: 'lucide:user',
      label: 'Thông tin tài khoản',
      path: '/taikhoan/thong-tin-ca-nhan'
    },
    {
      icon: 'lucide:shopping-bag',
      label: 'Đơn hàng của tôi',
      path: '/taikhoan/don-hang-cua-toi'
    },
    {
      icon: 'lucide:log-out',
      label: 'Đăng xuất',
      path: '/logout',
      action: () => {
        Cookies.remove('jwt');
        localStorage.removeItem('profile');
        window.location.href = '/';
      }
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <Card className="sticky top-8 self-start w-[280px] p-3 shadow-sm">
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const isActive = router.state.location.pathname === item.path;
                
                return item.action ? (
                  <button
                    key={item.path} 
                    onClick={item.action}
                    className='flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[#1A1A1A] hover:bg-[#E0F7FF] w-full text-left'
                  >
                    <Icon icon={item.icon} className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>

                  </button>
                ):(
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#338cf1] text-white'
                        : 'text-[#1A1A1A] hover:bg-[#E0F7FF]'
                    }`}
                  >
                    <Icon icon={item.icon} className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Main Content */}
          <Card className="flex-1 p-6 shadow-sm">
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};
