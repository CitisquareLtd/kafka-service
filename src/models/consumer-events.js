"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerEvents = void 0;
var ConsumerEvents;
(function (ConsumerEvents) {
    ConsumerEvents["READY"] = "ready";
    ConsumerEvents["CONNECTION_FAILURE"] = "connection.failure";
    ConsumerEvents["REBALANCE"] = "rebalance";
    ConsumerEvents["EVENT_LOG"] = "event.log";
    ConsumerEvents["EVENT_STATS"] = "event.stats";
    ConsumerEvents["EVENT_THROTTLE"] = "event.throttle";
    ConsumerEvents["EVENT_ERROR"] = "event.error";
    ConsumerEvents["DISCONNECTED"] = "disconnected";
    ConsumerEvents["UNSUBSCRIBED"] = "unsubscribed";
    ConsumerEvents["UNSUBSCRIBE"] = "unsubscribe";
    ConsumerEvents["SUBSCRIBE"] = "subscribe";
    ConsumerEvents["PARTITION"] = "partition.eof";
    ConsumerEvents["REBALANCE_ERROR"] = "rebalance.error";
    ConsumerEvents["OFFSET_COMMIT"] = "offset.commit";
    ConsumerEvents["DATA"] = "data";
    // GROUP_JOIN = 'consumer.group_join',
    // FETCH_START = 'consumer.fetch_start',
    // FETCH = 'consumer.fetch',
    // START_BATCH_PROCESS = 'consumer.start_batch_process',
    // END_BATCH_PROCESS = 'consumer.end_batch_process',
    // CONNECT = 'consumer.connect',
    // DISCONNECT = 'consumer.disconnect',
    // STOP = 'consumer.stop',
    // CRASH = 'consumer.crash',
    // REBALANCING = 'consumer.rebalancing',
    // RECEIVED_UNSUBSCRIBED_TOPICS = 'consumer.received_unsubscribed_topics',
    // REQUEST = 'consumer.network.request',
    // REQUEST_TIMEOUT = 'consumer.network.request_timeout',
    // REQUEST_QUEUE_SIZE = 'consumer.network.request_queue_size',
})(ConsumerEvents = exports.ConsumerEvents || (exports.ConsumerEvents = {}));
