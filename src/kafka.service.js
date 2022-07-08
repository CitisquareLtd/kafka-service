"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
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
const node_rdkafka_1 = __importDefault(require("node-rdkafka"));
const tsyringe_1 = require("tsyringe");
const kafka_topics_1 = require("./models/kafka-topics");
const validator_1 = __importDefault(require("./utils/validator"));
const uid_1 = require("uid");
let KafkaService = class KafkaService {
    constructor(
    // @inject('IKafKaConfig')
    config) {
        this.config = config;
        this.validator = new validator_1.default();
        this.isConsumerConnected = false;
        this.isProducerConnected = false;
        // this.kafka = new Kafka(this.config);
        let globalConfig = {
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
        this.producer = new node_rdkafka_1.default.Producer(globalConfig);
        this.consumer = new node_rdkafka_1.default.KafkaConsumer(Object.assign(Object.assign({}, globalConfig), { 'group.id': this.config.groupID }), {});
        // this.listen();
    }
    listenToConsumerEvent(eventName, listener) {
        return this.consumer.on(eventName, listener);
    }
    listenToProducerEvent(eventName, listener) {
        return this.producer.on(eventName, listener);
    }
    connectConsumer(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer.connect({ topic });
        });
    }
    connectProducer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect({});
        });
    }
    subscribeToTopics(topics) {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer.subscribe([...topics]);
        });
    }
    sendNotification(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isProducerConnected) {
                yield this.connectProducer();
            }
            this.validator.validateNotification(message);
            return this.producer.produce(
            // topic
            kafka_topics_1.KafkaTopic.NOTIFICATION, 
            // partition,
            // optionally we can manually specify a partition for the message
            // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
            null, 
            // message.value
            Buffer.from(JSON.stringify(message)), 
            // message.key, for keyed messages, we also specify the key - note that this field is optional
            message.messageId || (0, uid_1.uid)(20), 
            // you can send a timestamp here. If your broker version supports it,
            // it will get added. Otherwise, we default to 0
            Date.now()
            // you can send an opaque token here, which gets passed along
            // to your delivery reports
            );
        });
    }
    sendLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isProducerConnected) {
                yield this.connectProducer();
            }
            return this.producer.produce(
            // topic
            kafka_topics_1.KafkaTopic.AUDIT_TRAIL, 
            // partition,
            // optionally we can manually specify a partition for the message
            // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
            null, 
            // message.value
            Buffer.from(JSON.stringify(data)), 
            // message.key, for keyed messages, we also specify the key - note that this field is optional
            (0, uid_1.uid)(20), 
            // you can send a timestamp here. If your broker version supports it,
            // it will get added. Otherwise, we default to 0
            Date.now()
            // you can send an opaque token here, which gets passed along
            // to your delivery reports
            );
        });
    }
    listenForMessages(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConsumerConnected) {
                yield this.connectConsumer(data.topic);
            }
            this.consumer.on('data', ({ topic, partition, value, offset, key, timestamp, headers, size, opaque, }) => {
                console.log(data);
                let doc;
                doc = JSON.parse(value.toString());
                if (data.topic === topic && doc != null) {
                    data.handler({
                        key: key ? key.toString() : (0, uid_1.uid)(20),
                        value: doc,
                        attributes: size,
                        offset: offset,
                        size: size,
                        timestamp: timestamp,
                    }, partition);
                }
            });
        });
    }
    commitOffsets(topicPartitions) {
        this.consumer.commit(topicPartitions);
    }
};
KafkaService = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [Object])
], KafkaService);
exports.KafkaService = KafkaService;
