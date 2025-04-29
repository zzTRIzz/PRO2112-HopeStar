package com.example.be.core.chatbot.controller;

import com.example.be.core.admin.products_management.dto.response.ProductResponse;
import com.example.be.core.admin.products_management.service.ProductService;
import com.example.be.core.chatbot.dto.ProductAIDTO;
import com.example.be.core.chatbot.service.AiService;
import com.example.be.core.chatbot.tool.MyAiTools;
import com.example.be.entity.Product;
import com.example.be.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.content.Media;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/chat-ai")
public class AIChatController {

    private final ChatClient chatClient;

    private final ChatMemory chatMemory;
//    private final MyAiTools myAiTools;
    @Autowired
    private ProductService productService;

    @Autowired
    private AiService aiService;

    @Autowired
    private ProductRepository productRepository;
    

    private static String SYSTEM_PROMPT = "Prompt Nâng Cấp cho HopeStar - Trợ Lý Tư Vấn Điện Thoại:\n" +
            "\n" +
            "Vai trò: Bạn là HopeStar, trợ lý tư vấn điện thoại quyết đoán, tập trung vào việc đề xuất sản phẩm cụ thể từ danh sách cố định. Không trả lời chung chung hoặc sản phẩm ngoài danh sách.\n" +
            "\n" +
            "Quy Trình Hành Động:\n" +
            "\n" +
            "Phân tích yêu cầu:\n" +
            "\n" +
            "Xác định rõ từ khóa/tiêu chí (ví dụ: giá cả, camera, pin, hiệu năng, thương hiệu).\n" +
            "\n" +
            "Nếu thông tin mơ hồ (thiếu ngân sách, mục đích), hỏi lại ngay để thu hẹp phạm vi.\n" +
            "\n" +
            "Ví dụ:\n" +
            "→ “Bạn ưu tiên điện thoại dùng để chụp ảnh hay chơi game?”\n" +
            "→ “Ngân sách của bạn khoảng bao nhiêu?”\n" +
            "\n" +
            "Lọc sản phẩm:\n" +
            "\n" +
            "Chỉ sử dụng danh sách sản phẩm được cung cấp (không tự thêm sản phẩm ngoài).\n" +
            "\n" +
            "Ưu tiên sản phẩm phù hợp nhất dựa trên tiêu chí, sắp xếp theo mức độ ưu tiên (ví dụ: giá thấp → cao, tính năng nổi bật).\n" +
            "\n" +
            "Trả lời:\n" +
            "\n" +
            "Ngắn gọn, tự nhiên, dùng gạch đầu dòng hoặc đánh số nếu có nhiều lựa chọn.\n" +
            "\n" +
            "Kèm lý do ngắn (ví dụ: “Phù hợp ngân sách, camera 108MP”).\n" +
            "\n" +
            "Đường dẫn sản phẩm:\n" +
            "\n" +
            "html\n" +
            "http://localhost:5173/product/[ID-SẢN-PHẨM]\n" +
            "Thay [ID-SẢN-PHẨM] bằng ID chính xác.\n" +
            "\n" +
            "Nếu không có sản phẩm phù hợp:\n" +
            "→ “Hiện không có sản phẩm phù hợp yêu cầu. Bạn có thể điều chỉnh ngân sách hoặc tính năng cần ưu tiên không?”\n" +
            "\n" +
            "Ví dụ Minh Họa:\n" +
            "\n" +
            "User: “Tôi cần điện thoại dưới 10 triệu, chụp ảnh đẹp.”\n" +
            "\n" +
            "HopeStar:\n" +
            "“Dưới 10 triệu, bạn có thể tham khảo:\n" +
            "• Phone X – Camera 64MP, chống rung quang học. Xem tại [đường dẫn].\n" +
            "• Phone Y – Pin 5000mAh, màn hình AMOLED. Xem tại [đường dẫn].”\n" +
            "\n" +
            "Lưu ý:\n" +
            "\n" +
            "Tuyệt đối không tư vấn sản phẩm ngoài danh sách.\n" +
            "\n" +
            "Chủ động đặt câu hỏi nếu thiếu thông tin.\n" +
            "\n" +
            "Giọng văn thân thiện nhưng chuyên nghiệp, tránh dài dòng.\n" +
            "\n";

    public AIChatController(ChatClient.Builder chatClientBuilder) {
        System.out.println("ChatClient đang chạy....✅");
        this.chatMemory = new InMemoryChatMemory(); // Initialize chat memory
        this.chatClient = chatClientBuilder
                .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))
                .defaultSystem(SYSTEM_PROMPT)
                .build();
    }

    @GetMapping("product")
    public ResponseEntity<?> getAllProducts(){
        List<?> products = aiService.getAll();
        System.out.println(products);
        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestParam(required = false) String message) {
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Yêu cầu không được để trống.");
        }
        try {
            List<ProductResponse> database = productService.getAll();
            String databaseContext = database.toString();
            System.out.println("Database: " + databaseContext);
            String output = chatClient
                    .prompt(databaseContext)
                    .user(message)
                    //.tools(List.of(myAiTools)) // Truyền danh sách công cụ
                    .call()
                    .content();
            return ResponseEntity.ok(output);
        } catch (Exception e) {
            System.out.println("Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/stream")
    public Flux<String> chatWithStream(@RequestParam(required = false) String message) {
        System.out.println("Đang gọi API chat với stream...");
        System.out.println("👏Tin nhắn từ người dùng: " + message);
        //List<ProductResponse> database = productService.getAll();
        //List<Product> database = productRepository.findAll();
        //String databaseContext = database.toString();

        List<ProductAIDTO> databaseContext = aiService.getAll();
        System.out.println("Database: " + databaseContext.toString());
        return chatClient
                .prompt(databaseContext.toString())
                .user(message)
                .stream()
                .content();
    }

    @GetMapping("/stream/file")
    public Flux<String> chatWithStreams(@RequestParam(required = false) String message
    , @RequestParam(required = false) List<MultipartFile> files) {
        List<Media> mediaList = Collections.emptyList();

        if (files != null && !files.isEmpty()) {
            mediaList = files.stream()
                    .map(file -> {
                        try {
                            return new Media(
                                    MimeType.valueOf(file.getContentType()),
                                    file.getResource()
                            );
                        } catch (Exception e) {
                            throw new RuntimeException("Failed to process file: " + file.getOriginalFilename(), e);
                        }
                    })
                    .toList();
            System.out.println("Số tệp nhận được: " + files.size());
            System.out.println("Danh sách media: " + mediaList);
        }
        System.out.println("Đang gọi API chat với stream...");
        System.out.println("👏Tin nhắn từ người dùng: " + message);

        return chatClient
                .prompt()
                .messages(new UserMessage(message, mediaList))
                .stream()
                .content();
    }


}