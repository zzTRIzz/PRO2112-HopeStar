import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

interface ProductReviews {
  setOpen: (open: boolean) => void;
  open: boolean;
  // productDetail: productDetailViewResponse;
  hasPurchased: boolean;
  getAllReviews: () => void;
  currentProductDetail: any;
  reviewData: any;
}

const DanhGiaSanPham: React.FC<ProductReviews> = ({ setOpen, open,reviewData, hasPurchased, getAllReviews, currentProductDetail }) => {
  const [generalRating, setGeneralRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleStarClick = (value: number): void => {
    setGeneralRating(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'upload-hopestar');

      const response = await fetch('https://api.cloudinary.com/v1_1/ddqlt2k9e/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload ảnh thất bại:', error);
        throw new Error('Không thể upload ảnh');
      }

      const data = await response.json();
      urls.push(data.secure_url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (generalRating < 1) {
      alert('Vui lòng đánh giá sản phẩm.');
      return;
    }

    if (comment.length < 15) {
      alert('Vui lòng nhập tối thiểu 15 ký tự.');
      return;
    }

    try {
      setIsSubmitting(true);
      const jwt = Cookies.get('jwt');
      if (!jwt) throw new Error('Khách hàng chưa đăng nhập');

      // Upload ảnh trước
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        uploadedImageUrls = await uploadImagesToCloudinary(images);
      }

      // Sau đó gửi đánh giá
      const response = await fetch('http://localhost:8080/api/product-reviews/create-product-reviews', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productDetailId: currentProductDetail?.productDetailId,
          generalRating,
          comment,
          imageUrls: uploadedImageUrls,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const result = await response.json();
      console.log('Gửi đánh giá thành công:', result);
      getAllReviews();

      setOpen(false);
      setGeneralRating(0);
      setComment('');
      setImages([]);
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false); // Kết thúc quá trình gửi đánh giá
    }
  };
  const handDanhGia = () => {
    getAllReviews();
    setOpen(true);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handDanhGia}>
          Đánh giá
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full">
        {hasPurchased ? (
          <div className="w-full bg-white rounded-lg p-4 space-y-6">
            <h2 className="text-lg font-bold">Đánh giá & nhận xét</h2>
            <div className="text-base font-bold text-green-600">
             {reviewData?.product}
            </div>
            <div>
              <div className="text-sm font-semibold mb-1">Đánh giá chung</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <div
                    key={val}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleStarClick(val)}
                  >
                    <Icon
                      icon="lucide:star"
                      className={`text-2xl ${val <= generalRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                    <span className="text-xs mt-1">
                      {val === 1 ? 'Rất Tệ' : val === 2 ? 'Tệ' : val === 3 ? 'Bình thường' : val === 4 ? 'Tốt' : 'Tuyệt vời'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <textarea
              className="w-full border border-gray-300 rounded p-2 text-sm"
              rows={4}
              placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 ký tự)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <Icon icon="lucide:image-plus" className="text-lg" />
                Thêm hình ảnh
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((file, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    className="absolute top-1 right-1 text-white rounded-full p-1 text-xs text-red-500"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full py-2 rounded font-semibold ${isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang đánh giá...' : 'Gửi Đánh Giá'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <img
              src="https://fptshop.com.vn/img/reject-rating.png?w=640&q=75"
              alt="Chưa mua sản phẩm"
              className="w-65 h-50 object-contain"
            />
            <div className="text-red-500 font-bold text-center">
              Gửi đánh giá không thành công!
            </div>
            <p> Quý khách vui lòng mua hàng để tham gia đánh giá sản phẩm.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DanhGiaSanPham;
