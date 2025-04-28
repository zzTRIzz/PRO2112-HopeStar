package com.example.be.core.chatbot.mapper;

import com.example.be.core.chatbot.dto.ProductAIDTO;
import com.example.be.core.chatbot.dto.ProductDetailAIDTO;
import com.example.be.entity.*;
import com.example.be.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductAIMapper {

    @Autowired
    private ChipRepository chipRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ScreenRepository screenRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private OsRepository osRepository;

    @Autowired
    private WifiRepository wifiRepository;

    @Autowired
    private BluetoothRepository bluetoothRepository;

    @Autowired
    private BatteryRepository batteryRepository;

    @Autowired
    private FrontCameraProductRepository frontCameraProductRepository;

    @Autowired
    private RearCameraProductRepository rearCameraProductRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductSimRepository productSimRepository;


    // Chuyển đổi từ Product Entity -> ProductDTO
    public ProductAIDTO entityToDTO(Product entity) {
        ProductAIDTO dto = new ProductAIDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setWeight(entity.getWeight());
        dto.setNameChip(chipRepository.findById(entity.getChip().getId())
                .orElse(null)
                .getName());
        dto.setNameBrand(brandRepository.findById(entity.getBrand().getId()).map(Brand::getName).orElse(null));
        dto.setTypeScreen(screenRepository.findById(entity.getScreen().getId()).map(Screen::getType).orElse(null));
        dto.setTypeCard(cardRepository.findById(entity.getCard().getId()).map(Card::getType).orElse(null));
        dto.setNameOs(osRepository.findById(entity.getOs().getId()).map(Os::getName).orElse(null));
        dto.setNameWifi(wifiRepository.findById(entity.getWifi().getId()).map(Wifi::getName).orElse(null));
        dto.setNameBluetooth(bluetoothRepository.findById(entity.getBluetooth().getId()).map(Bluetooth::getName).orElse(null));
        dto.setTypeBattery(batteryRepository.findById(entity.getBattery().getId()).map(Battery::getType).orElse(null));
//        dto.setIdChip(entity.getChip() != null ? entity.getChip().getId() : null);
//        dto.setIdBrand(entity.getBrand() != null ? entity.getBrand().getId() : null);
//        dto.setIdScreen(entity.getScreen() != null ? entity.getScreen().getId() : null);
//        dto.setIdCard(entity.getCard() != null ? entity.getCard().getId() : null);
//        dto.setIdOs(entity.getOs() != null ? entity.getOs().getId() : null);
//        dto.setIdWifi(entity.getWifi() != null ? entity.getWifi().getId() : null);
//        dto.setIdBluetooth(entity.getBluetooth() != null ? entity.getBluetooth().getId() : null);
//        dto.setNfc(entity.getNfc());
//        dto.setIdBattery(entity.getBattery() != null ? entity.getBattery().getId() : null);
        dto.setChargerType(entity.getChargerType());
        dto.setStatus(entity.getStatus());
        dto.setContent(entity.getContent());
        dto.setFrontCamera(frontCameraProductRepository.findByProductId(entity.getId())
                .stream()
                .map(f -> f.getFrontCamera().getResolution() +" "+f.getFrontCamera().getType() + (f.getCameraMain() ? " (main)" : ""))
                .collect(Collectors.toList()));
        dto.setRearCamera(rearCameraProductRepository.findByProductId(entity.getId())
                .stream()
                .map(f -> f.getRearCamera().getResolution() +" "+f.getRearCamera().getType() + (f.getCameraMain() ? " (main)" : ""))
                .collect(Collectors.toList()));
        dto.setCategory(productCategoryRepository.findByProductId(entity.getId()).stream().map(c->c.getCategory().getName()).collect(Collectors.toList()));
        dto.setSim(productSimRepository.findByProductId(entity.getId()).stream().map(s->s.getSim().getType()).collect(Collectors.toList()));

        List<ProductDetailAIDTO> detailAIDTOList = entity.getProductDetails().stream()
                .map(detail -> {
                    ProductDetailAIDTO detailAIDTO = new ProductDetailAIDTO();
                    detailAIDTO.setPriceSell(detail.getPriceSell());
                    detailAIDTO.setInventoryQuantity(detail.getInventoryQuantity());
                    detailAIDTO.setStatus(detail.getStatus());
                    detailAIDTO.setColorName(detail.getColor() != null ? detail.getColor().getName() : null);
                    detailAIDTO.setRamCapacity(detail.getRam() != null ? detail.getRam().getCapacity() : null);
                    detailAIDTO.setRomCapacity(detail.getRom() != null ? detail.getRom().getCapacity() : null);
                    return detailAIDTO;
                })
                .collect(Collectors.toList());
        dto.setDetails(detailAIDTOList);
        return dto;
    }
}
