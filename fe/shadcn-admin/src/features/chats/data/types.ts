export interface UserChat{
    id: number,
    avatar:string,
    name: string,
    message: string,
    role: boolean,
}

export interface ChatMessage {
    id: number,
    conversationId:string,
    senderId: number,
    receiverId: number,
    message: string,
    timestamp: string,
    status: string,
}