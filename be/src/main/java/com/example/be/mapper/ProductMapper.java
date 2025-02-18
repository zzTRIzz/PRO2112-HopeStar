package com.example.be.mapper;

import com.example.be.dto.ProductDTO;
import com.example.be.entity.*;
import com.example.be.repository.*;
import com.example.be.request.product.ProductRequest;
import com.example.be.response.ProductResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductMapper {

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

    // Chuyển đổi từ ProductRequest -> ProductDTO
    public ProductDTO requestToDTO(ProductRequest request) {
        ProductDTO dto = new ProductDTO();
        dto.setName(request.getName());
        dto.setDescription(request.getDescription());
        dto.setWeight(request.getWeight());
        dto.setIdChip(request.getIdChip());
        dto.setIdBrand(request.getIdBrand());
        dto.setIdScreen(request.getIdScreen());
        dto.setIdCard(request.getIdCard());
        dto.setIdOs(request.getIdOs());
        dto.setIdWifi(request.getIdWifi());
        dto.setIdBluetooth(request.getIdBluetooth());
        dto.setNfc(request.getNfc());
        dto.setIdBattery(request.getIdBattery());
        dto.setChargerType(request.getChargerType());
        dto.setStatus(request.getStatus());
        dto.setContent(request.getContent());
        dto.setFrontCamera(request.getFrontCamera());
        dto.setRearCamera(request.getRearCamera());
        dto.setCategory(request.getCategory());
        return dto;
    }

    // Chuyển đổi từ ProductDTO -> Product Entity
    public Product dtoToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setWeight(dto.getWeight());
        product.setChip(chipRepository.findById(dto.getIdChip()).orElse(null));
        product.setBrand(brandRepository.findById(dto.getIdBrand()).orElse(null));
        product.setScreen(screenRepository.findById(dto.getIdScreen()).orElse(null));
        product.setCard(cardRepository.findById(dto.getIdCard()).orElse(null));
        product.setOs(osRepository.findById(dto.getIdOs()).orElse(null));
        product.setWifi(wifiRepository.findById(dto.getIdWifi()).orElse(null));
        product.setBluetooth(bluetoothRepository.findById(dto.getIdBluetooth()).orElse(null));
        product.setNfc(dto.getNfc());
        product.setBattery(batteryRepository.findById(dto.getIdBattery()).orElse(null));
        product.setChargerType(dto.getChargerType());
        product.setStatus(dto.getStatus());
        product.setContent(dto.getContent());
        return product;
    }

    // Chuyển đổi từ Product Entity -> ProductDTO
    public ProductDTO entityToDTO(Product entity) {
        ProductDTO dto = new ProductDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setWeight(entity.getWeight());
        dto.setIdChip(entity.getChip() != null ? entity.getChip().getId() : null);
        dto.setIdBrand(entity.getBrand() != null ? entity.getBrand().getId() : null);
        dto.setIdScreen(entity.getScreen() != null ? entity.getScreen().getId() : null);
        dto.setIdCard(entity.getCard() != null ? entity.getCard().getId() : null);
        dto.setIdOs(entity.getOs() != null ? entity.getOs().getId() : null);
        dto.setIdWifi(entity.getWifi() != null ? entity.getWifi().getId() : null);
        dto.setIdBluetooth(entity.getBluetooth() != null ? entity.getBluetooth().getId() : null);
        dto.setNfc(entity.getNfc());
        dto.setIdBattery(entity.getBattery() != null ? entity.getBattery().getId() : null);
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
        return dto;
    }

    // Chuyển đổi từ ProductDTO -> ProductResponse
    public ProductResponse dtoToResponse(ProductDTO dto) {
        ProductResponse response = new ProductResponse();
        response.setId(dto.getId());
        response.setCode(dto.getCode());
        response.setName(dto.getName());
        response.setDescription(dto.getDescription());
        response.setWeight(dto.getWeight());
        response.setNameChip(chipRepository.findById(dto.getIdChip()).map(Chip::getName).orElse(null));
        response.setNameBrand(brandRepository.findById(dto.getIdBrand()).map(Brand::getName).orElse(null));
        response.setTypeScreen(screenRepository.findById(dto.getIdScreen()).map(Screen::getType).orElse(null));
        response.setTypeCard(cardRepository.findById(dto.getIdCard()).map(Card::getType).orElse(null));
        response.setNameOs(osRepository.findById(dto.getIdOs()).map(Os::getName).orElse(null));
        response.setNameWifi(wifiRepository.findById(dto.getIdWifi()).map(Wifi::getName).orElse(null));
        response.setNameBluetooth(bluetoothRepository.findById(dto.getIdBluetooth()).map(Bluetooth::getName).orElse(null));
        response.setTypeBattery(batteryRepository.findById(dto.getIdBattery()).map(Battery::getType).orElse(null));
        response.setNfc(dto.getNfc());
        response.setChargerType(dto.getChargerType());
        response.setStatus(dto.getStatus());
        response.setContent(dto.getContent());
        response.setFrontCamera(dto.getFrontCamera());
        response.setRearCamera(dto.getRearCamera());
        response.setCategory(dto.getCategory());
        return response;
    }
}
