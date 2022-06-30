import {
  ConnectEvent,
  Consumer,
  ConsumerCommitOffsetsEvent,
  Kafka,
  Message,
  Producer,
  ProducerRecord,
  RecordMetadata,
  RemoveInstrumentationEventListener,
  TopicPartitionOffsetAndMetadata,
  ValueOf,
} from 'kafkajs';
import { delay, inject, injectable, singleton, registry } from 'tsyringe';
import { ConsumerEvents } from './models/consumer-events';
import { IAudit } from './models/i-audit';
import { IKafkaMessage, IKafkaMessageHandler } from './models/i-kafka-message';
import { IMessage } from './models/i-message';
import { IKafKaConfig } from './models/kafka-config';
import { KafkaTopic } from './models/kafka-topics';
import { ProducerEvents } from './models/producer-events';
import Validator from './utils/validator';
import {uid} from 'uid';

@singleton()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  validator: Validator = new Validator();

  isConsumerConnected: boolean = false;
  isProducerConnected: boolean = false;

  constructor(
    // @inject('IKafKaConfig')
    private config: IKafKaConfig
  ) {
    this.kafka = new Kafka(this.config);

    this.producer = this.kafka.producer({});
    this.consumer = this.kafka.consumer({
      groupId: this.config.groupID,
      allowAutoTopicCreation: true,
    });

    // this.listen();
  }

  public listenToConsumerEvent(
    eventName: ConsumerEvents,
    listener: (event: ConsumerCommitOffsetsEvent) => void
  ): RemoveInstrumentationEventListener<ValueOf<ConsumerEvents>> {
    return this.consumer.on(eventName, listener);
  }

  public listenToProducerEvent(
    eventName: ProducerEvents,
    listener: (event: ConnectEvent) => void
  ): RemoveInstrumentationEventListener<ValueOf<ProducerEvents>> {
    return this.producer.on(eventName, listener);
  }

  public connectConsumer(): Promise<void> {
    return this.consumer.connect();
  }

  public connectProducer(): Promise<void> {
    return this.producer.connect();
  }

  public async subscribeToTopics(topics: KafkaTopic[]): Promise<void> {
    return this.consumer.subscribe({ topics });
  }

  public async sendNotification(message: IMessage): Promise<RecordMetadata[]> {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }

    this.validator.validateNotification(message);

    return this.producer.send({
      topic: KafkaTopic.NOTIFICATION,
      acks: 1,
      messages: [{ value: JSON.stringify(message), key: message.messageId || uid(20) }],
    });
  }

  public async sendLog(data: IAudit): Promise<RecordMetadata[]> {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }
    return this.producer.send({
      topic: KafkaTopic.AUDIT_TRAIL,
      acks: 1,
      messages: [{ value: JSON.stringify(data) }],
    });
  }

  public async listenForMessages(data: IKafkaMessageHandler): Promise<any> {
    if (!this.isConsumerConnected) {
      await this.connectConsumer();
    }

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let doc: IMessage;
        doc = JSON.parse(message.value.toString());
        if (data.topic === topic && doc != null) {
          data.handler(
            {
              key:message? message.key.toString() : uid(20),
              value: doc,
              attributes: message.attributes,
              offset: message.offset,
              size: message.size,
              timestamp: message.timestamp,
            },
            partition
          );
        }
      },
    });
  }

  public commitOffsets(topicPartitions: TopicPartitionOffsetAndMetadata[]) {
    this.consumer.commitOffsets(topicPartitions);
  }
}
