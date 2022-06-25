import { Consumer, Kafka, Message, Producer, ProducerRecord, RecordMetadata } from 'kafkajs';
import { delay, inject, injectable, singleton, registry } from 'tsyringe';
import { ConsumerEvents } from './models/consumer-events';
import { IKafkaMessage, IKafkaMessageHandler } from './models/i-kafka-message';
import { IKafKaConfig } from './models/kafka-config';
import { KafkaTopic } from './models/kafka-topics';
import { ProducerEvents } from './models/producer-events';

@singleton()
export class KafkaService {
  kafka: Kafka;
  producer: Producer;
  consumer: Consumer;

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

    this.listen();
  }

  private listen() {
    this.producer.on(ProducerEvents.CONNECT, (event) => {
      console.log('kafka producer connected', event);
      this.isProducerConnected = true;
    });
    this.producer.on(ProducerEvents.DISCONNECT, (event) => {
      console.log('kafka producer disconnected', event);
      this.isProducerConnected = false;
    });

    this.consumer.on(ConsumerEvents.CONNECT, (event) => {
      console.log('kafka consumer connected', event);
      this.isConsumerConnected = true;
    });
    this.consumer.on(ConsumerEvents.DISCONNECT, (event) => {
      console.log('kafka consumer disconnected', event);
      this.isConsumerConnected = false;
    });
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

  public async send(data:ProducerRecord
    //  {
    // topic: KafkaTopic;
    // acks: number;
    // messages: Message[];
  // }
  ): Promise<RecordMetadata[]> {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }

    return this.producer.send({
      topic: data.topic,
      acks: data.acks,
      messages: data.messages,
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
