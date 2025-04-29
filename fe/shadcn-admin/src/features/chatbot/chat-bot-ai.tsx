import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalBody,
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Avatar,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

function ChatMessage({ message }: { message: Message }) {
  // Parse links in message content if it's from the bot
  const formatContent = (content: string) => {
    if (message.isBot) {
      return (
        <div dangerouslySetInnerHTML={{ 
          __html: content.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g, 
            '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>'
          ).replace(
            /\*\*([^*]+)\*\*/g,
            '<strong>$1</strong>'
          ).replace(/\n/g, '<br />')
        }} />
      );
    }
    return content;
  };

  return (
    <div className={`flex gap-3 ${message.isBot ? "justify-start" : "justify-end"}`}>
      {message.isBot && (
        <Avatar
          src="https://static.thenounproject.com/png/7262146-200.png"
          className="w-8 h-8"
        />
      )}
      <Card className={`max-w-[80%] ${message.isBot ? "bg-default-50" : "bg-primary-500"}`}>
        <CardBody className={`p-3 text-sm ${message.isBot ? "text-default-700" : "text-white"}`}>
          {formatContent(message.content)}
        </CardBody>
      </Card>
      {!message.isBot && (
        <Avatar
          src="https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg"
          className="w-8 h-8"
        />
      )}
    </div>
  );
}

export default function ChatBotAi() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const signupData = JSON.parse(localStorage.getItem('profile') || '{}')
    if (isOpen && messages.length === 0) {
      const welcomeMessages = [
        {
          id: "welcome-1",
          content: signupData.name? `Xin chào **${signupData.name}**, tôi là AI hỗ trợ của HopeStar`: "Xin chào, tôi là AI hỗ trợ của HopeStar",
          isBot: true,
          timestamp: new Date(),
        },
        {
          id: "welcome-2",
          content: "Tôi có thể giúp gì cho bạn hôm nay?",
          isBot: true,
          timestamp: new Date(),
        },
      ];
      setMessages(welcomeMessages);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Add a loading message
      const loadingMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: loadingMsgId,
        content: "Đang suy nghĩ...",
        isBot: true,
        timestamp: new Date()
      }]);

      const signupData = JSON.parse(localStorage.getItem('profile') || '{}')
      // Call the streaming API
      const response = await fetch(`http://localhost:8080/chat-ai/stream?message=${encodeURIComponent(inputValue + " " + signupData.name)}`);
      
      if (!response.ok) {
        throw new Error("API request failed");
      }

      // Create a reader from the response body
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to read response");
      
      // Remove the loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMsgId));
      
      const decoder = new TextDecoder();
      let responseText = "";
      
      // Add an empty bot message that will be incrementally updated
      const botMessageId = (Date.now() + 2).toString();
      setMessages(prev => [...prev, {
        id: botMessageId,
        content: "",
        isBot: true,
        timestamp: new Date()
      }]);
      
      // Read and process the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Decode the chunk and append it to the accumulated text
        const chunk = decoder.decode(value, { stream: true });
        responseText += chunk;
        
        // Update the bot message with the accumulated text
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: responseText } 
              : msg
          )
        );
      }
      
    } catch (error) {
      console.error("Gặp vấn đề trong lúc fetching API:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        content: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Button
        isIconOnly
        color="primary"
        variant="solid"
        onPress={onOpen}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
      >
        <Icon icon="lucide:bot" className="h-7 w-7" />
        {/* <Icon icon="lucide:bot-message-square" className="h-6 w-6" /> */}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-4">
                <div className="flex flex-col h-[61vh]">
                  <div className="flex items-center mb-4">
                    <h1 className="text-xl font-semibold">Tư vấn viên AI</h1>
                  </div>
                  
                  <div
                    ref={chatRef}
                    className="flex-grow overflow-y-auto space-y-4 p-2"
                  >
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </div>
                  
                  <div className="border-t border-default-200 pt-4 mt-4">
                    <Input
                      radius="full"
                      placeholder="Cho tôi biết bạn cần giúp gì..."
                      value={inputValue}
                      onValueChange={setInputValue}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      disabled={isLoading}
                      endContent={
                        <Button
                          isIconOnly
                          color="primary"
                          variant="flat"
                          onPress={handleSend}
                          isLoading={isLoading}
                          className="h-8 rounded-full"
                        >
                          <Icon icon="lucide:send" className="h-3 w-3" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}