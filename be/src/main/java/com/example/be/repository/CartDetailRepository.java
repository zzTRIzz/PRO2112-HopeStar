package com.example.be.repository;

import com.example.be.entity.CartDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.entity.status.StatusCartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {
    @Query("SELECT c FROM CartDetail c WHERE c.idShoppingCart.id = :idGH")
    List<CartDetail> findByIdGH(@Param("idGH") Integer idGH);


    @Query("""
            SELECT cd FROM CartDetail cd
            JOIN cd.idProductDetail pd
            JOIN cd.idShoppingCart c
            WHERE cd.status = :status AND c.id = :idCart
            """)
    List<CartDetail> thanhToanGioHang(@Param("idCart") Integer idCart,
                                      @Param("status") StatusCartDetail status);


    @Query("""
            SELECT cd FROM CartDetail cd
            JOIN cd.idProductDetail pd
            JOIN cd.idShoppingCart c
            WHERE c.id = :idCart
            """)
    List<CartDetail> capNhatTrangThaiGioHangChiTietTheoGH(@Param("idCart") int idCart);

    List<CartDetail> findCartDetailByIdShoppingCartAndStatus(ShoppingCart shoppingCart,StatusCartDetail statusCartDetail);

}
