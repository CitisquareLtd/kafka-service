import { KafkaService } from './src/kafka.service';
import { ProducerEvents } from './src/models/producer-events';
import { ConsumerEvents } from './src/models/consumer-events';
import { KafkaTopic } from './src/models/kafka-topics';
import { IKafKaConfig } from './src/models/kafka-config';
import { IKafkaMessage, IKafkaMessageHandler } from './src/models/i-kafka-message';
import { CompressionTypes, Message } from 'kafkajs';
import { IMessage } from './src/models/i-message';
import { IChannel } from './src/models/i-channel';
import { IMessagePriority } from './src/models/i-message-priority';

export {
  KafkaService,
  ProducerEvents,
  ConsumerEvents,
  IKafkaMessage,
  IKafkaMessageHandler,
  KafkaTopic,
  IKafKaConfig,
  Message,
  IMessage,
  IChannel,
  IMessagePriority,
};
