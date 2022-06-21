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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.KafkaService = exports.ConsumerEvents = exports.ProducerEvents = void 0;
const kafkajs_1 = require("kafkajs");
const tsyringe_1 = require("tsyringe");
var ProducerEvents;
(function (ProducerEvents) {
    ProducerEvents["CONNECT"] = "producer.connect";
    ProducerEvents["DISCONNECT"] = "producer.disconnect";
    ProducerEvents["REQUEST"] = "producer.network.request";
    ProducerEvents["REQUEST_TIMEOUT"] = "producer.network.request_timeout";
    ProducerEvents["REQUEST_QUEUE_SIZE"] = "producer.network.request_queue_size";
})(ProducerEvents = exports.ProducerEvents || (exports.ProducerEvents = {}));
var ConsumerEvents;
(function (ConsumerEvents) {
    ConsumerEvents["HEARTBEAT"] = "consumer.heartbeat";
    ConsumerEvents["COMMIT_OFFSETS"] = "consumer.commit_offsets";
    ConsumerEvents["GROUP_JOIN"] = "consumer.group_join";
    ConsumerEvents["FETCH_START"] = "consumer.fetch_start";
    ConsumerEvents["FETCH"] = "consumer.fetch";
    ConsumerEvents["START_BATCH_PROCESS"] = "consumer.start_batch_process";
    ConsumerEvents["END_BATCH_PROCESS"] = "consumer.end_batch_process";
    ConsumerEvents["CONNECT"] = "consumer.connect";
    ConsumerEvents["DISCONNECT"] = "consumer.disconnect";
    ConsumerEvents["STOP"] = "consumer.stop";
    ConsumerEvents["CRASH"] = "consumer.crash";
    ConsumerEvents["REBALANCING"] = "consumer.rebalancing";
    ConsumerEvents["RECEIVED_UNSUBSCRIBED_TOPICS"] = "consumer.received_unsubscribed_topics";
    ConsumerEvents["REQUEST"] = "consumer.network.request";
    ConsumerEvents["REQUEST_TIMEOUT"] = "consumer.network.request_timeout";
    ConsumerEvents["REQUEST_QUEUE_SIZE"] = "consumer.network.request_queue_size";
})(ConsumerEvents = exports.ConsumerEvents || (exports.ConsumerEvents = {}));
let KafkaService = class KafkaService {
    constructor(config) {
        this.config = config;
        this.isConsumerConnected = false;
        this.isProducerConnected = false;
        this.run = () => __awaiter(this, void 0, void 0, function* () {
            // Producing
            yield this.producer.connect();
            yield this.producer.send({
                topic: 'test-topic',
                acks: 1,
                messages: [{ value: 'Hello KafkaJS user!' }],
            });
            // Consuming
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
            yield this.consumer.run({
                eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                    console.log({
                        partition,
                        offset: message.offset,
                        value: message.value,
                    });
                }),
            });
        });
        this.kafka = new kafkajs_1.Kafka({
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
    listen() {
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
};
KafkaService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('IKafKaConfig')),
    __metadata("design:paramtypes", [Object])
], KafkaService);
exports.KafkaService = KafkaService;
