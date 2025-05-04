import { createLazyFileRoute } from '@tanstack/react-router'
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import Navbar from '@/features/ui-client/components/navbar';
import Footer from '@/components/layout/footer';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/(auth)/chinh-sach-cua-cua-hang/')({
  component: RouteComponent,
})

function RouteComponent() {
    useEffect(() => {
            document.title = 'Chính sách cửa hàng | HopeStar'
            return () => {
              document.title = 'HopeStar'
            }
          }, [])
  return <>
  <Navbar />
  <div className="max-w-6xl mx-auto p-4 space-y-6">
  {/* Warranty Policy */}
  <Card>
    <CardHeader className="flex gap-3">
      <Icon icon="lucide:shield" className="text-xl" />
      <h2 className="text-xl font-semibold">Chính sách hỗ trợ</h2>
    </CardHeader>
    <CardBody>
      <div className="space-y-4">
        <div>
          {/* <h3 className="font-medium mb-2">Đối với sản phẩm chính hãng:</h3> */}
          <ul className="list-disc ml-6 space-y-2">
            <li>Khách hàng tự liên hệ trực tiếp với hãng/trung tâm bảo hành được chỉ định</li>
            <li>Cửa hàng hỗ trợ trung gian trong quá trình mang sản phẩm đi bảo hành.</li>
          </ul>
        </div>
        <Divider/>
        <div>
          <h3 className="font-medium mb-2">Những sản phẩm không thuộc cửa hàng, không còn hóa đơn</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Không áp dụng bảo hành dưới mọi hình thức.</li>
            <li>Cửa hàng chỉ hỗ trợ kiểm tra máy trước khi giao hàng.</li>
          </ul>
        </div>
      </div>
    </CardBody>
  </Card>

  {/* Defective Orders Process */}
  {/* <Card>
    <CardHeader className="flex gap-3">
      <Icon icon="lucide:alert-triangle" className="text-xl" />
      <h2 className="text-xl font-semibold">Quy trình xử lý đơn hàng lỗi</h2>
    </CardHeader>
    <CardBody>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Báo cáo sự cố:</h3>
          <p>Thông báo qua Hotline/Email trong vòng 24 giờ kể từ khi nhận hàng, kèm ảnh/video minh chứng.</p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Xác minh:</h3>
          <p>Cửa hàng phối hợp với đơn vị vận chuyển để xác định nguyên nhân (mất 1–3 ngày làm việc).</p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Giải quyết:</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Nếu lỗi do vận chuyển: Hoàn tiền/đổi hàng tương đương.</li>
            <li>Nếu lỗi do khách hàng: Không áp dụng bồi thường.</li>
          </ul>
        </div>
      </div>
    </CardBody>
  </Card> */}

  {/* Shipping & Compensation */}
  <Card>
    <CardHeader className="flex gap-3">
      <Icon icon="lucide:truck" className="text-xl" />
      <h2 className="text-xl font-semibold">Chính sách vận chuyển bên đơn vị vận chuyển Giao Hàng Tiết Kiệm</h2>
    </CardHeader>
    <CardBody>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Phí khai giá (Phí bảo hiểm):</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Phí không bắt buộc nhưng được khuyến nghị cho đơn hàng giá trị cao.</li>
            <li>Tính theo tỷ lệ % trên giá trị khai báo của sản phẩm.</li>
            <li>Được bồi thường tối đa bằng giá trị đã khai báo nếu xảy ra sự cố.</li>
          </ul>
        </div>
        <Divider/>
        <div>
          <h3 className="font-medium mb-2">Lưu ý quan trọng:</h3>
          <ul className="list-disc ml-6 space-y-2">
            {/* <li>Không đóng phí khai giá: bồi thường tối đa 30% giá trị đơn hàng.</li> */}
            <li>Cửa hàng không chịu trách nhiệm nếu khách hàng từ chối đóng phí khai giá cho đơn hàng giá trị cao.</li>
            <li>GHTK chịu trách nhiệm, bồi hoàn 100% giá trị khai giá khi mất hàng (tối đa 20,000,000 VNĐ) nếu có giấy tờ chứng minh nguồn gốc 
            và giá trị hàng hoá</li>
            {/* <li>Trong trường hợp shop không thể 
            chứng minh nguồn gốc và giá trị hàng hoá, bồi thường tối đa 04 lần cước phí vận chuyển.</li> */}
          </ul>
        </div>
      </div>
    </CardBody>
  </Card>
  {/* Payment Methods */}
  <Card>
    <CardHeader className="flex gap-3">
      <Icon icon="lucide:credit-card" className="text-xl" />
      <h2 className="text-xl font-semibold">Phương thức thanh toán</h2>
    </CardHeader>
    <CardBody>
      <ul className="list-disc ml-6 space-y-2">
        <li>Tiền mặt</li>
        <li>Thẻ ngân hàng (VNPay)</li>
      </ul>
    </CardBody>
  </Card>

  {/* Contact Information */}
  <Card>
    <CardHeader className="flex gap-3">
      <Icon icon="lucide:contact" className="text-xl" />
      <h2 className="text-xl font-semibold">Thông tin liên hệ</h2>
    </CardHeader>
    <CardBody>
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <Icon icon="lucide:map-pin" className="text-lg mt-1" />
          <p>Hòe Thị, Phương Canh, Nam Từ Liêm, Hà Nội, Việt Nam</p>
        </div>
        <div className="flex gap-3 items-center">
          <Icon icon="lucide:phone" className="text-lg" />
          <p>+84 358 168 699</p>
        </div>
        <div className="flex gap-3 items-center">
          <Icon icon="lucide:mail" className="text-lg" />
          <p>contact@hopestar.com</p>
        </div>
      </div>
    </CardBody>
  </Card>

  
</div>
  <Footer/>
  </>
}
