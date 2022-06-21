import { Consumer, Kafka, Producer, RecordMetadata } from 'kafkajs';
import { IKafkaMessageHandler } from './models/i-kafka-message';
import { IKafKaConfig } from './models/kafka-config';
import { KafkaTopic } from './models/kafka-topics';
export declare class KafkaService {
    private config;
    kafka: Kafka;
    producer: Producer;
    consumer: Consumer;
    isConsumerConnected: boolean;
    isProducerConnected: boolean;
    constructor(config: IKafKaConfig);
    private listen;
    connectConsumer(): Promise<void>;
    connectProducer(): Promise<void>;
    subscribeToTopics(topics: KafkaTopic[]): Promise<void>;
    send(data: {
        topic: KafkaTopic;
        acks: number;
    }): Promise<RecordMetadata[]>;
    listenForMessages(data: IKafkaMessageHandler): Promise<any>;
}
