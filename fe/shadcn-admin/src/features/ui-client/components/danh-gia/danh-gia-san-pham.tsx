import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { productDetailViewResponse } from '../../data/schema';

interface RatingRequest {
  generalRating: number;
  detailRatings: Record<string, number>;
  comment: string;
  images: string[];
}
interface Review {
  setOpen: (open: boolean) => void;
  open: boolean;
  productDetail: productDetailViewResponse;
}
const DanhGiaSanPham: React.FC<Review> = ({ setOpen, open, productDetail }) => {
  const [generalRating, setGeneralRating] = useState<number>(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState<string>('');
  // const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleStarClick = (field: string, value: number): void => {
    if (field === 'general') {
      setGeneralRating(value);
    } else {
      setRatings((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (comment.length < 15) {
      alert("Vui lòng nhập tối thiểu 15 ký tự.");
      return;
    }

    try {
      // Upload ảnh lên server
      // const uploadedUrls = await Promise.all(
      //   images.map(async (file) => {
      //     const formData = new FormData();
      //     formData.append("image", file);

      //     const response = await fetch("/api/upload", {
      //       method: "POST",
      //       body: formData,
      //     });

      //     const data = await response.json();
      //     return data.url; // Giả sử API trả về URL public
      //   })
      // );

      // Tạo request với URLs thay vì File
      const request: RatingRequest = {
        generalRating,
        detailRatings: ratings,
        comment,
        images: imagePreviews,
      };

      console.log("Submit Request:", request);
      // Gửi request này đến API lưu đánh giá
      // await fetch("/api/reviews", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(request),
      // });

      // Reset form sau khi submit
      setOpen(false);
      setGeneralRating(0);
      setRatings({});
      setComment("");
      // setImages([]);
      setImagePreviews([]);

    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Cập nhật danh sách file gốc
      // setImages(prev => [...prev, ...files]);

      // Tạo URL preview và cập nhật state
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-600 text-white hover:bg-blue-700' onClick={() => setOpen(true)}
        >Đánh giá</Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl w-full'>
        <div className='w-full bg-white rounded-lg p-4 space-y-6'>
          <h2 className='text-lg font-bold'>Đánh giá & nhận xét</h2>
          <div className='text-base font-bold text-green-600'>
            {productDetail?.productName}
          </div>

          <div>
            <div className='text-sm font-semibold mb-1'>Đánh giá chung</div>
            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((val) => (
                <div
                  key={val}
                  className='flex flex-col items-center cursor-pointer'
                  onClick={() => handleStarClick('general', val)}
                >
                  <Icon
                    icon='lucide:star'
                    className={`text-2xl ${val <= generalRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                  <span className='text-xs mt-1'>
                    {val === 1
                      ? 'Rất Tệ'
                      : val === 2
                        ? 'Tệ'
                        : val === 3
                          ? 'Bình thường'
                          : val === 4
                            ? 'Tốt'
                            : 'Tuyệt vời'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <textarea
            className='w-full border border-gray-300 rounded p-2 text-sm'
            rows={4}
            placeholder='Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 ký tự)'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div>
            <label className='inline-flex items-center gap-2 cursor-pointer text-sm'>
              <Icon icon='lucide:image-plus' className='text-lg' />
              Thêm hình ảnh
              <input
                type='file'
                multiple
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={src} // Hiển thị URL preview
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  className="absolute top-1 right-1 text-white rounded-full p-1 text-xs"
                  onClick={() => {
                    // setImages(prev => prev.filter((_, i) => i !== index));
                    setImagePreviews(prev => prev.filter((_, i) => i !== index));
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className='w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold'
          >
            Gửi Đánh Giá
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DanhGiaSanPham;
