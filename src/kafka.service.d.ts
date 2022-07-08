import { IAudit } from './models/i-audit';
import { IKafkaMessageHandler } from './models/i-kafka-message';
import { IMessage } from './models/i-message';
import { IKafKaConfig } from './models/kafka-config';
import { KafkaTopic } from './models/kafka-topics';
import Validator from './utils/validator';
declare type KafkaClientEvents = 'disconnected' | 'ready' | 'connection.failure' | 'event.error' | 'event.stats' | 'event.log' | 'event.event' | 'event.throttle';
declare type KafkaConsumerEvents = 'data' | 'partition.eof' | 'rebalance' | 'rebalance.error' | 'subscribed' | 'unsubscribed' | 'unsubscribe' | 'offset.commit' | KafkaClientEvents;
declare type KafkaProducerEvents = 'delivery-report' | KafkaClientEvents;
export declare class KafkaService {
    private config;
    private producer;
    private consumer;
    validator: Validator;
    isConsumerConnected: boolean;
    isProducerConnected: boolean;
    constructor(config: IKafKaConfig);
    listenToConsumerEvent(eventName: KafkaConsumerEvents, listener: (event: any) => void): any;
    listenToProducerEvent(eventName: KafkaProducerEvents, listener: (event: any) => void): any;
    connectConsumer(topic: string): Promise<void>;
    connectProducer(): Promise<void>;
    subscribeToTopics(topics: KafkaTopic[]): Promise<void>;
    sendNotification(message: IMessage): Promise<any>;
    sendLog(data: IAudit): Promise<any>;
    listenForMessages(data: IKafkaMessageHandler): Promise<any>;
    commitOffsets(topicPartitions: {
        offset: number;
        partition: 0;
        topic: string;
    }): void;
}
export {};
