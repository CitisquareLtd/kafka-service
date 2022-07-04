"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerEvents = void 0;
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