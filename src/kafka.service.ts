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

@singleton()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

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

  private async send(data: ProducerRecord): Promise<RecordMetadata[]> {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }

    return this.producer.send({
      topic: data.topic,
      acks: data.acks,
      messages: data.messages,
    });
  }

  public async sendNotification(message: IMessage): Promise<RecordMetadata[]> {
    return this.producer.send({
      topic: KafkaTopic.NOTIFICATION,
      acks: 1,
      messages: [{ value: JSON.stringify(message), key: message.messageId }],
    });
  }

  public async sendLog(data: IAudit): Promise<RecordMetadata[]> {
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
        if (data.topic === topic) {
          data.handler(message, partition);
        }
      },
    });
  }
}
