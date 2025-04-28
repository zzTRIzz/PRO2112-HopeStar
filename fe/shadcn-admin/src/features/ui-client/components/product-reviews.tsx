import { Button } from '@/components/ui/button';
import { Card, CardBody, Avatar, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import DanhGiaSanPham from './danh-gia/danh-gia-san-pham';
import { productDetailViewResponse } from '../data/schema';
import Cookies from 'js-cookie';

export interface Review {
  id: number;
  account: Account;
  generalRating: number;
  dateAssessment: string;
  comment: string;
  imageUrls?: string[];
}

interface Account {
  fullName: string;
  avatar: string;
}

interface RatingSummary {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
  total: number;
}

interface RatingData {
  reviews: Review[];
  ratingSummaryResponse: RatingSummary | null;
  hasPurchased: boolean;
  numberSold: number;
  evaluate: number;
}

interface ReviewsProps {
  productDetail: productDetailViewResponse;
  currentProductDetail: any;
  onUpdateStats: (stats: { numberSol: number; evaluat: number }) => void;
}

const ProductReviews: React.FC<ReviewsProps> = ({ productDetail, currentProductDetail }) => {
  const [open, setOpen] = React.useState(false);
  const [reviewData, setReviewData] = useState<RatingData>({
    reviews: [],
    ratingSummaryResponse: null,
    hasPurchased: false,
    evaluate: 0,
    numberSold: 0
  });

  const [displayLimit, setDisplayLimit] = useState(3);

  const getAllReviews = async () => {
    try {
      const jwt = Cookies.get('jwt');
      console.log('jwt', jwt)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }

      const response = await fetch(`http://localhost:8080/api/product-reviews/${currentProductDetail?.productDetailId}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`Lỗi server: ${response.status}`);
      }


      const data = await response.json();
      if (data && data.data) {
        setReviewData(data.data);
      } else {
        console.warn('Không có dữ liệu đánh giá.');
        setReviewData({
          reviews: [],
          ratingSummaryResponse: null,
          hasPurchased: false,
          evaluate: 0,
          numberSold: 0
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    }
  };

  const ratingStats = reviewData.ratingSummaryResponse || {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
    total: 0,
  };

  const averageRating =
    (5 * ratingStats.fiveStar +
      4 * ratingStats.fourStar +
      3 * ratingStats.threeStar +
      2 * ratingStats.twoStar +
      1 * ratingStats.oneStar) /
    (ratingStats.total || 1);

  useEffect(() => {
    if (currentProductDetail?.productDetailId) {
      getAllReviews();
    }
  }, [currentProductDetail?.productDetailId, getAllReviews]);

  return (
    <div className="space-y-4">
      {/* Tổng quan đánh giá */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      icon="lucide:star"
                      className={
                        i < Math.floor(averageRating)
                          ? 'text-warning'
                          : 'text-default-300'
                      }
                    />
                  ))}
                </div>
                <div className="text-small text-default-500">
                  {ratingStats.total} đánh giá
                </div>
                <DanhGiaSanPham
                  open={open}
                  setOpen={setOpen}
                  productDetail={productDetail}
                  hasPurchased={reviewData.hasPurchased}
                  getAllReviews={getAllReviews}
                  currentProductDetail={currentProductDetail}
                />
              </div>
              <div className="flex-1 space-y-2">
                {[
                  { stars: 5, count: ratingStats.fiveStar },
                  { stars: 4, count: ratingStats.fourStar },
                  { stars: 3, count: ratingStats.threeStar },
                  { stars: 2, count: ratingStats.twoStar },
                  { stars: 1, count: ratingStats.oneStar },
                ].map((stat) => (
                  <div key={stat.stars} className="flex items-center gap-2">
                    <div className="w-8 text-small">{stat.stars}★</div>
                    <Progress
                      aria-label={`${stat.stars} stars`}
                      value={(stat.count / (ratingStats.total || 1)) * 100}
                      className="flex-1"
                    />
                    <div className="w-12 text-right text-small">
                      {stat.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        {reviewData.reviews.slice(0, displayLimit).map((rv) => (
          <Card key={rv.id}>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar src={rv.account.avatar} name={rv.account.fullName} />
                  <div>
                    <div className="font-semibold">{rv.account.fullName}</div>
                    <div className="flex items-center gap-2 text-small text-default-500">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            icon="lucide:star"
                            className={
                              i < rv.generalRating
                                ? 'text-warning'
                                : 'text-default-300'
                            }
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <time dateTime={rv.dateAssessment}>
                        {new Date(rv.dateAssessment).toLocaleDateString(
                          'vi-VN'
                        )}
                      </time>
                    </div>
                  </div>
                </div>
                <p>{rv.comment}</p>
                {rv.imageUrls && (
                  <div className='flex gap-2'>
                    {rv.imageUrls.map((img, index) => (
                      <img key={index} src={img} className="w-20 h-20 object-cover rounded" alt="Ảnh đánh giá" />
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Nút xem thêm */}
      {reviewData?.reviews?.length > displayLimit && (
        <div className="flex justify-center mt-4">
          <Button variant={'outline'}
            onClick={() => setDisplayLimit((prev) => prev + 3)}
          >
            Xem thêm đánh giá
          </Button>
        </div>
      )}

    </div>
  );
};

export default ProductReviews;