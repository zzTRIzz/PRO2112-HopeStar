import { Link } from '@tanstack/react-router'
import { Card, CardContent } from './ui/card'
import { getBrandActive} from '@/features/product-management/product/data/api-service'
import { useQuery } from '@tanstack/react-query'

// const categories = [
//   {
//     id: 1,
//     name: 'Apple',
//     imageUrl: 'https://banner2.cleanpng.com/20180616/yox/aa6i9u0ms.webp', // Thay URL này bằng URL hình ảnh thực tế
//     color: 'bg-blue-50 text-blue-600',
//     href: '/category/apple',
//   },
//   {
//     id: 2,
//     name: 'Samsung',
//     imageUrl:
//       'https://banner2.cleanpng.com/20190221/sgy/kisspng-logo-samsung-group-trademark-samsung-electronics-f-samsung-logo-png-hd-samsung-logo-png-image-free-1713906289413.webp', // Thay URL này bằng URL hình ảnh thực tế
//     color: 'bg-blue-50 text-blue-600',
//     href: '/category/samsung',
//   },
//   {
//     id: 3,
//     name: 'Xiaomi',
//     imageUrl:
//       'https://e7.pngegg.com/pngimages/835/385/png-clipart-xiaomi-mi-logo-xiaomi-mobile-phones-computer-icons-battery-charger-brand-miscellaneous-angle-thumbnail.png', // Thay URL này bằng URL hình ảnh thực tế
//     color: 'bg-blue-50 text-blue-600',
//     href: '/category/xiaomi',
//   },
//   {
//     id: 4,
//     name: 'Oppo',
//     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/OPPO_LOGO_2019.png', // Thay URL này bằng URL hình ảnh thực tế
//     color: 'bg-blue-50 text-blue-600',
//     href: '/category/oppo',
//   },
//   {
//     id: 5,
//     name: 'Oneplus',
//     imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm7zidwWSDtHxxGlFkH-oCDM3bVRlH5sSXVg&s', // Thay URL này bằng URL hình ảnh thực tế
//     color: 'bg-blue-50 text-blue-600',
//     href: '/category/oneplus',
//   },
//   {
//     id: 6,
//     name: 'Realme',
//     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Realme-realme-_logo_box-RGB-01.svg/2560px-Realme-realme-_logo_box-RGB-01.svg.png', // Thay URL này bằng URL hình ảnh thực tế
//     color: 'bg-blue-50 text-blue-600',
//     href: '/category/realme',
//   },
// ]
interface Brand {
  id: number
  name: string
  imageUrl: string
}
export default function Categories() {
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrandActive,
  })
  return (
    <section className='container bg-muted/30 py-16'>
      <h2 className='mb-8 text-center text-3xl font-bold'>
        Các hãng hay thương hiệu
      </h2>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
        {brands?.map((brand:Brand) => (
          <Link to="/dienthoai" search={{
            brand: brand.id,
          }}  key={brand.id}>
            <Card className='h-full cursor-pointer transition-shadow hover:shadow-md'>
              <CardContent className='flex flex-col items-center justify-center p-6'>
                <div
                  className={`bg-blue-50 text-blue-600 flex items-center justify-center rounded-full p-4`}
                >
                  <img
                    src={brand?.imageUrl}
                    alt={`${brand?.name} logo`}
                    className='h-8 w-8 object-contain'
                  />
                </div>
                <h3 className='mt-3 font-medium'>{brand.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

