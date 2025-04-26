package com.example.be.repository;

import com.example.be.entity.ChatMessage;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByConversationIdOrderByTimestampAsc(String conversationId);

    @Aggregation(pipeline = {
            "{ $match: { $or: [ { senderId: ?0 }, { receiverId: ?0 } ] } }",
            "{ $sort: { timestamp: -1 } }",
            "{ $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' } } }",
            "{ $sort: { 'lastMessage.timestamp': -1 } }",
            "{ $replaceRoot: { newRoot: '$lastMessage' } }"
    })
    List<ChatMessage> findLatestMessagesForAdmin(Integer adminId);

}
