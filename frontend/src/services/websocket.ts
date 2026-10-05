import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../types/chat';

class WebSocketService {
  private client: Client | null = null;
  private currentSubscription: StompSubscription | null = null;
  private isConnected: boolean = false;

  public connect(onConnected: () => void, onError: (err: any) => void): void {
    if (this.client && this.isConnected) {
      onConnected();
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      debug: (msg) => {
        // Uncomment for STOMP debugging
        // console.log('[STOMP]', msg);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.isConnected = true;
      console.log('Connected to WebSocket server');
      onConnected();
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message'], frame.body);
      this.isConnected = false;
      onError(frame);
    };

    this.client.onWebSocketClose = () => {
      this.isConnected = false;
    };

    this.client.activate();
  }

  public subscribeToRoom(roomId: string, onMessageReceived: (message: ChatMessage) => void): void {
    if (!this.client || !this.isConnected) {
      console.warn('Cannot subscribe: STOMP client not connected');
      return;
    }

    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    this.currentSubscription = this.client.subscribe(`/topic/room/${roomId}`, (messageFrame) => {
      try {
        const message: ChatMessage = JSON.parse(messageFrame.body);
        onMessageReceived(message);
      } catch (e) {
        console.error('Failed to parse WebSocket message', e);
      }
    });
  }

  public sendMessage(roomId: string, message: ChatMessage): void {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat.sendMessage/${roomId}`,
        body: JSON.stringify(message),
      });
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public joinRoom(roomId: string, message: ChatMessage): void {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat.addUser/${roomId}`,
        body: JSON.stringify(message),
      });
    }
  }

  public sendTypingStatus(roomId: string, message: ChatMessage): void {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat.typing/${roomId}`,
        body: JSON.stringify(message),
      });
    }
  }

  public disconnect(): void {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const webSocketService = new WebSocketService();
