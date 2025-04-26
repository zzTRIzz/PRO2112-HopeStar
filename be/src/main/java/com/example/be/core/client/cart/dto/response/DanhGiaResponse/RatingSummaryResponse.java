package com.example.be.core.client.cart.dto.response.DanhGiaResponse;

import lombok.Data;
@Data
public class RatingSummaryResponse {

        private Integer oneStar = 0;
        private Integer twoStar = 0;
        private Integer threeStar = 0;
        private Integer fourStar = 0;
        private Integer fiveStar = 0;
        private Integer total = 0;

        public void addRating(Integer rating) {
            switch (rating) {
                case 1 -> oneStar++;
                case 2 -> twoStar++;
                case 3 -> threeStar++;
                case 4 -> fourStar++;
                case 5 -> fiveStar++;
            }
            total++;
        }
}
