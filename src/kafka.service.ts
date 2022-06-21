import { Consumer, Kafka, Producer } from 'kafkajs';
import { delay, inject, injectable, singleton, registry } from 'tsyringe';

export interface IKafKaConfig {
  brokers: string[];
  groupID: string;
  //   topic: string;
  clientId: string;
}

export enum ProducerEvents {
  CONNECT = 'producer.connect',
  DISCONNECT = 'producer.disconnect',
  REQUEST = 'producer.network.request',
  REQUEST_TIMEOUT = 'producer.network.request_timeout',
  REQUEST_QUEUE_SIZE = 'producer.network.request_queue_size',
}

export enum ConsumerEvents {
  HEARTBEAT = 'consumer.heartbeat',
  COMMIT_OFFSETS = 'consumer.commit_offsets',
  GROUP_JOIN = 'consumer.group_join',
  FETCH_START = 'consumer.fetch_start',
  FETCH = 'consumer.fetch',
  START_BATCH_PROCESS = 'consumer.start_batch_process',
  END_BATCH_PROCESS = 'consumer.end_batch_process',
  CONNECT = 'consumer.connect',
  DISCONNECT = 'consumer.disconnect',
  STOP = 'consumer.stop',
  CRASH = 'consumer.crash',
  REBALANCING = 'consumer.rebalancing',
  RECEIVED_UNSUBSCRIBED_TOPICS = 'consumer.received_unsubscribed_topics',
  REQUEST = 'consumer.network.request',
  REQUEST_TIMEOUT = 'consumer.network.request_timeout',
  REQUEST_QUEUE_SIZE = 'consumer.network.request_queue_size',
}

@singleton()
export class KafkaService {
  kafka: Kafka;
  producer: Producer;
  consumer: Consumer;

  isConsumerConnected: boolean = false;
  isProducerConnected: boolean = false;

  constructor(
    @inject('IKafKaConfig')
    private config: IKafKaConfig
  ) {
    this.kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: this.config.brokers || ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.config.groupID,
      allowAutoTopicCreation: true,
    });

    this.listen();
  }

  private listen() {
    this.producer.on(ProducerEvents.CONNECT, (event) => {
      console.log('connected', event);
      this.isProducerConnected = true;
    });
    this.producer.on(ProducerEvents.DISCONNECT, (event) => {
      console.log('disconnected', event);
      this.isProducerConnected = false;
    });

    this.consumer.on(ConsumerEvents.CONNECT, (event) => {
      console.log('connected', event);
      this.isConsumerConnected = true;
    });
    this.consumer.on(ConsumerEvents.DISCONNECT, (event) => {
      console.log('disconnected', event);
      this.isConsumerConnected = false;
    });
     this.consumer.on(ConsumerEvents.REQUEST, (event) => {
       console.log('request', event);
       this.isConsumerConnected = false;
     });
  }

  run = async () => {
    // Producing
    await this.producer.connect();
    await this.producer.send({
      topic: 'test-topic',
      acks: 1,
      messages: [{ value: 'Hello KafkaJS user!' }],
    });

    // Consuming
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value,
        });
      },
    });
  };
}
