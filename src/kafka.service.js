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
const kafkajs_1 = require("kafkajs");
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
        this.kafka = new kafkajs_1.Kafka(this.config);
        this.producer = this.kafka.producer({});
        this.consumer = this.kafka.consumer({
            groupId: this.config.groupID,
            allowAutoTopicCreation: true,
        });
        // this.listen();
    }
    listenToConsumerEvent(eventName, listener) {
        return this.consumer.on(eventName, listener);
    }
    listenToProducerEvent(eventName, listener) {
        return this.producer.on(eventName, listener);
    }
    connectConsumer() {
        return this.consumer.connect();
    }
    connectProducer() {
        return this.producer.connect();
    }
    subscribeToTopics(topics) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.consumer.subscribe({ topics });
        });
    }
    sendNotification(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isProducerConnected) {
                yield this.connectProducer();
            }
            this.validator.validateNotification(message);
            return this.producer.send({
                topic: kafka_topics_1.KafkaTopic.NOTIFICATION,
                acks: 1,
                messages: [{ value: JSON.stringify(message), key: message.messageId || (0, uid_1.uid)(20) }],
            });
        });
    }
    sendLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isProducerConnected) {
                yield this.connectProducer();
            }
            return this.producer.send({
                topic: kafka_topics_1.KafkaTopic.AUDIT_TRAIL,
                acks: 1,
                messages: [{ value: JSON.stringify(data) }],
            });
        });
    }
    listenForMessages(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConsumerConnected) {
                yield this.connectConsumer();
            }
            yield this.consumer.run({
                eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                    let doc;
                    doc = JSON.parse(message.value.toString());
                    if (data.topic === topic && doc != null) {
                        data.handler({
                            key: message.key ? message.key.toString() : (0, uid_1.uid)(20),
                            value: doc,
                            attributes: message.attributes,
                            offset: message.offset,
                            size: message.size,
                            timestamp: message.timestamp,
                        }, partition);
                    }
                }),
            });
        });
    }
    commitOffsets(topicPartitions) {
        this.consumer.commitOffsets(topicPartitions);
    }
};
KafkaService = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [Object])
], KafkaService);
exports.KafkaService = KafkaService;
