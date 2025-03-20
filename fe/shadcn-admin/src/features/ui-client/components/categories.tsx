import { Link } from '@tanstack/react-router'
import { Card, CardContent } from './ui/card'

const categories = [
  {
    id: 1,
    name: 'Apple',
    imageUrl: 'https://banner2.cleanpng.com/20180616/yox/aa6i9u0ms.webp', // Thay URL này bằng URL hình ảnh thực tế
    color: 'bg-blue-50 text-blue-600',
    href: '/category/apple',
  },
  {
    id: 2,
    name: 'Samsung',
    imageUrl:
      'https://banner2.cleanpng.com/20190221/sgy/kisspng-logo-samsung-group-trademark-samsung-electronics-f-samsung-logo-png-hd-samsung-logo-png-image-free-1713906289413.webp', // Thay URL này bằng URL hình ảnh thực tế
    color: 'bg-blue-50 text-blue-600',
    href: '/category/samsung',
  },
  {
    id: 3,
    name: 'Xiaomi',
    imageUrl:
      'https://e7.pngegg.com/pngimages/835/385/png-clipart-xiaomi-mi-logo-xiaomi-mobile-phones-computer-icons-battery-charger-brand-miscellaneous-angle-thumbnail.png', // Thay URL này bằng URL hình ảnh thực tế
    color: 'bg-blue-50 text-blue-600',
    href: '/category/xiaomi',
  },
  {
    id: 4,
    name: 'Oppo',
    imageUrl: 'https://example.com/oppo-logo.png', // Thay URL này bằng URL hình ảnh thực tế
    color: 'bg-blue-50 text-blue-600',
    href: '/category/oppo',
  },
  {
    id: 5,
    name: 'Oneplus',
    imageUrl: 'https://example.com/oneplus-logo.png', // Thay URL này bằng URL hình ảnh thực tế
    color: 'bg-blue-50 text-blue-600',
    href: '/category/oneplus',
  },
  {
    id: 6,
    name: 'Realme',
    imageUrl: 'https://example.com/realme-logo.png', // Thay URL này bằng URL hình ảnh thực tế
    color: 'bg-blue-50 text-blue-600',
    href: '/category/realme',
  },
]

export default function Categories() {
  return (
    <section className='container bg-muted/30 py-16'>
      <h2 className='mb-8 text-center text-3xl font-bold'>
        Các hãng hay thương hiệu này (category)
      </h2>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
        {categories.map((category) => (
          <Link to={category.href} key={category.id}>
            <Card className='h-full cursor-pointer transition-shadow hover:shadow-md'>
              <CardContent className='flex flex-col items-center justify-center p-6'>
                <div
                  className={`${category.color} flex items-center justify-center rounded-full p-4`}
                >
                  <img
                    src={category.imageUrl}
                    alt={`${category.name} logo`}
                    className='h-8 w-8 object-contain'
                  />
                </div>
                <h3 className='mt-3 font-medium'>{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

// import { Link } from "react-router-dom";
// import { Card, CardContent } from "./ui/card";
// import {
//   Smartphone,
//   Tablet,
//   Watch,
//   Headphones,
//   Speaker,
//   Cpu,
// } from "lucide-react";

// const categories = [
//   {
//     id: 1,
//     name: "Apple",
//     icon: <Smartphone className="h-8 w-8 mb-2" />,
//     color: "bg-blue-50 text-blue-600",
//     href: "/category/apple",
//   },
//   {
//     id: 1,
//     name: "Samsung",
//     icon: <Smartphone className="h-8 w-8 mb-2" />,
//     color: "bg-blue-50 text-blue-600",
//     href: "/category/samsung",
//   },
//   {
//     id: 1,
//     name: "Xiaomi",
//     icon: <Smartphone className="h-8 w-8 mb-2" />,
//     color: "bg-blue-50 text-blue-600",
//     href: "/category/xiaomi",
//   },
//   {
//     id: 1,
//     name: "Oppo",
//     icon: <Smartphone className="h-8 w-8 mb-2" />,
//     color: "bg-blue-50 text-blue-600",
//     href: "/category/oppo",
//   },
//   {
//     id: 1,
//     name: "Oneplus",
//     icon: <Smartphone className="h-8 w-8 mb-2" />,
//     color: "bg-blue-50 text-blue-600",
//     href: "/category/oneplus",
//   },
//   {
//     id: 1,
//     name: "Realme",
//     icon: <Smartphone className="h-8 w-8 mb-2" />,
//     color: "bg-blue-50 text-blue-600",
//     href: "/category/realme",
//   },
//   // {
//   //   id: 2,
//   //   name: "Tablets",
//   //   icon: <Tablet className="h-8 w-8 mb-2" />,
//   //   color: "bg-purple-50 text-purple-600",
//   //   href: "/category/tablets",
//   // },
//   // {
//   //   id: 3,
//   //   name: "Smartwatches",
//   //   icon: <Watch className="h-8 w-8 mb-2" />,
//   //   color: "bg-green-50 text-green-600",
//   //   href: "/category/smartwatches",
//   // },
//   // {
//   //   id: 4,
//   //   name: "Headphones",
//   //   icon: <Headphones className="h-8 w-8 mb-2" />,
//   //   color: "bg-yellow-50 text-yellow-600",
//   //   href: "/category/headphones",
//   // },
//   // {
//   //   id: 5,
//   //   name: "Speakers",
//   //   icon: <Speaker className="h-8 w-8 mb-2" />,
//   //   color: "bg-red-50 text-red-600",
//   //   href: "/category/speakers",
//   // },
//   // {
//   //   id: 6,
//   //   name: "Accessories",
//   //   icon: <Cpu className="h-8 w-8 mb-2" />,
//   //   color: "bg-indigo-50 text-indigo-600",
//   //   href: "/category/accessories",
//   // },
// ];

// export default function Categories() {
//   return (
//     <section className="container py-16 bg-muted/30">
//       <h2 className="text-3xl font-bold mb-8 text-center">Browse Categories</h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         {categories.map((category) => (
//           <Link to={category.href} key={category.id}>
//             <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
//               <CardContent className="flex flex-col items-center justify-center p-6">
//                 <div className={`${category.color} p-4 rounded-full`}>
//                   {category.icon}
//                 </div>
//                 <h3 className="font-medium mt-3">{category.name}</h3>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }
