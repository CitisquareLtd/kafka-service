// import {
//   ConnectEvent,
//   Consumer,
//   ConsumerCommitOffsetsEvent,
//   Kafka,
//   Message,
//   Producer,
//   ProducerRecord,
//   RecordMetadata,
//   RemoveInstrumentationEventListener,
//   TopicPartitionOffsetAndMetadata,
//   ValueOf,
// } from 'kafkajs';
import Kafka from 'node-rdkafka';
import { delay, inject, injectable, singleton, registry } from 'tsyringe';
import { ConsumerEvents } from './models/consumer-events';
import { IAudit } from './models/i-audit';
import { IKafkaMessage, IKafkaMessageHandler } from './models/i-kafka-message';
import { IMessage } from './models/i-message';
import { IKafKaConfig } from './models/kafka-config';
import { KafkaTopic } from './models/kafka-topics';
import { ProducerEvents } from './models/producer-events';
import Validator from './utils/validator';
import { uid } from 'uid';
type KafkaClientEvents =
  | 'disconnected'
  | 'ready'
  | 'connection.failure'
  | 'event.error'
  | 'event.stats'
  | 'event.log'
  | 'event.event'
  | 'event.throttle';
type KafkaConsumerEvents =
  | 'data'
  | 'partition.eof'
  | 'rebalance'
  | 'rebalance.error'
  | 'subscribed'
  | 'unsubscribed'
  | 'unsubscribe'
  | 'offset.commit'
  | KafkaClientEvents;
type KafkaProducerEvents = 'delivery-report' | KafkaClientEvents;

@singleton()
export class KafkaService {
  // private kafka: Kafka;
  private producer: Kafka.Producer;
  private consumer: Kafka.KafkaConsumer;
  validator: Validator = new Validator();

  isConsumerConnected: boolean = false;
  isProducerConnected: boolean = false;

  constructor(
    // @inject('IKafKaConfig')
    private config: IKafKaConfig
  ) {
    // this.kafka = new Kafka(this.config);
    let globalConfig: Kafka.GlobalConfig = {
      'bootstrap.servers': this.config.brokers.join(','),
      'client.id': this.config.clientId,
    };
    if (this.config.ssl) {
      globalConfig['ssl.ca.location'] = this.config.ssl.ca;
      // globalConfig['ssl.ca.location'] = this.config.ssl.ca;
    }
    if (this.config.sasl) {
      globalConfig['security.protocol'] = 'sasl_ssl';
      globalConfig['sasl.mechanism'] = this.config.sasl.mechanism;
      globalConfig['sasl.username'] = this.config.sasl.username;
      globalConfig['sasl.password'] = this.config.sasl.password;
      globalConfig['sasl.password'] = this.config.sasl.password;
    }

    this.producer = new Kafka.Producer(globalConfig);
    this.consumer = new Kafka.KafkaConsumer(
      { ...globalConfig, 'group.id': this.config.groupID },
      {}
    );

    // this.listen();
  }

  public listenToConsumerEvent(
    eventName: KafkaConsumerEvents,
    listener: (event: any) => void
  ): any {
    return this.consumer.on(eventName, listener);
  }

  public listenToProducerEvent(
    eventName: KafkaProducerEvents,
    listener: (event: any) => void
  ): any {
    return this.producer.on(eventName, listener);
  }

  public async connectConsumer(topic: string): Promise<void> {
    this.consumer.connect({ topic });
  }

  public async connectProducer(): Promise<void> {
    await this.producer.connect({});
  }

  public async subscribeToTopics(topics: KafkaTopic[]): Promise<void> {
    this.consumer.subscribe([...topics]);
  }

  public async sendNotification(message: IMessage): Promise<any> {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }

    this.validator.validateNotification(message);

    return this.producer.produce(
      // topic
      KafkaTopic.NOTIFICATION,
      // partition,
      // optionally we can manually specify a partition for the message
      // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
      null,
      // message.value
      Buffer.from(JSON.stringify(message)),
      // message.key, for keyed messages, we also specify the key - note that this field is optional
      message.messageId || uid(20),
      // you can send a timestamp here. If your broker version supports it,
      // it will get added. Otherwise, we default to 0
      Date.now()
      // you can send an opaque token here, which gets passed along
      // to your delivery reports
    );
  }

  public async sendLog(data: IAudit): Promise<any> {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }
    return this.producer.produce(
      // topic
      KafkaTopic.AUDIT_TRAIL,
      // partition,
      // optionally we can manually specify a partition for the message
      // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
      null,
      // message.value
      Buffer.from(JSON.stringify(data)),
      // message.key, for keyed messages, we also specify the key - note that this field is optional
      uid(20),
      // you can send a timestamp here. If your broker version supports it,
      // it will get added. Otherwise, we default to 0
      Date.now()
      // you can send an opaque token here, which gets passed along
      // to your delivery reports
    );
  }

  public async listenForMessages(data: IKafkaMessageHandler): Promise<any> {
    if (!this.isConsumerConnected) {
      await this.connectConsumer(data.topic);
    }
    this.consumer.on('ready', () => {
      console.log('Consumer is ready');
      this.consumer.commit();
    });

    this.consumer.on(
      'data',
      ({
        topic,
        partition,
        value,
        offset,
        key,
        timestamp,
        headers,
        size,
        opaque,
      }) => {
        console.log(data);
        let doc: IMessage;
        doc = JSON.parse(value.toString());
        if (data.topic === topic && doc != null) {
          data.handler(
            {
              key: key ? key.toString() : uid(20),
              value: doc,
              attributes: size,
              offset: offset,
              size: size,
              timestamp: timestamp,
            },
            partition
          );
        }
      }
    );
  }

  public commitOffsets(topicPartitions: {
    offset: number;
    partition: number;
    topic: string;
  }) {
    this.consumer.commit(topicPartitions);
  }
}
