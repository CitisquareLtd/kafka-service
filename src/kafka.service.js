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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const kafkajs_1 = require("kafkajs");
const tsyringe_1 = require("tsyringe");
const consumer_events_1 = require("./models/consumer-events");
const producer_events_1 = require("./models/producer-events");
let KafkaService = class KafkaService {
    constructor(
    // @inject('IKafKaConfig')
    config) {
        this.config = config;
        this.isConsumerConnected = false;
        this.isProducerConnected = false;
        this.kafka = new kafkajs_1.Kafka(this.config);
        this.producer = this.kafka.producer({});
        this.consumer = this.kafka.consumer({
            groupId: this.config.groupID,
            allowAutoTopicCreation: true,
        });
        this.listen();
    }
    listen() {
        this.producer.on(producer_events_1.ProducerEvents.CONNECT, (event) => {
            console.log('kafka producer connected', event);
            this.isProducerConnected = true;
        });
        this.producer.on(producer_events_1.ProducerEvents.DISCONNECT, (event) => {
            console.log('kafka producer disconnected', event);
            this.isProducerConnected = false;
        });
        this.consumer.on(consumer_events_1.ConsumerEvents.CONNECT, (event) => {
            console.log('kafka consumer connected', event);
            this.isConsumerConnected = true;
        });
        this.consumer.on(consumer_events_1.ConsumerEvents.DISCONNECT, (event) => {
            console.log('kafka consumer disconnected', event);
            this.isConsumerConnected = false;
        });
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
    send(data
    //  {
    // topic: KafkaTopic;
    // acks: number;
    // messages: Message[];
    // }
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isProducerConnected) {
                yield this.connectProducer();
            }
            return this.producer.send({
                topic: data.topic,
                acks: data.acks,
                messages: data.messages,
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
                    if (data.topic === topic) {
                        data.handler(message, partition);
                    }
                }),
            });
        });
    }
};
KafkaService = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [Object])
], KafkaService);
exports.KafkaService = KafkaService;
