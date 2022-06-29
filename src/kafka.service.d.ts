import { ConnectEvent, ConsumerCommitOffsetsEvent, RecordMetadata, RemoveInstrumentationEventListener, TopicPartitionOffsetAndMetadata, ValueOf } from 'kafkajs';
import { ConsumerEvents } from './models/consumer-events';
import { IAudit } from './models/i-audit';
import { IKafkaMessageHandler } from './models/i-kafka-message';
import { IMessage } from './models/i-message';
import { IKafKaConfig } from './models/kafka-config';
import { KafkaTopic } from './models/kafka-topics';
import { ProducerEvents } from './models/producer-events';
import Validator from './utils/validator';
export declare class KafkaService {
    private config;
    private kafka;
    private producer;
    private consumer;
    validator: Validator;
    isConsumerConnected: boolean;
    isProducerConnected: boolean;
    constructor(config: IKafKaConfig);
    listenToConsumerEvent(eventName: ConsumerEvents, listener: (event: ConsumerCommitOffsetsEvent) => void): RemoveInstrumentationEventListener<ValueOf<ConsumerEvents>>;
    listenToProducerEvent(eventName: ProducerEvents, listener: (event: ConnectEvent) => void): RemoveInstrumentationEventListener<ValueOf<ProducerEvents>>;
    connectConsumer(): Promise<void>;
    connectProducer(): Promise<void>;
    subscribeToTopics(topics: KafkaTopic[]): Promise<void>;
    sendNotification(message: IMessage): Promise<RecordMetadata[]>;
    sendLog(data: IAudit): Promise<RecordMetadata[]>;
    listenForMessages(data: IKafkaMessageHandler): Promise<any>;
    commitOffsets(topicPartitions: TopicPartitionOffsetAndMetadata[]): void;
}
