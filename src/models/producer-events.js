"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerEvents = void 0;
var ProducerEvents;
(function (ProducerEvents) {
    ProducerEvents["READY"] = "ready";
    ProducerEvents["CONNECTION_FAILURE"] = "connection.failure";
    ProducerEvents["EVENT_LOG"] = "event.log";
    ProducerEvents["EVENT_STATS"] = "event.stats";
    ProducerEvents["EVENT_THROTTLE"] = "event.throttle";
    ProducerEvents["EVENT_ERROR"] = "event.error";
    ProducerEvents["DELIVERY_REPORT"] = "delivery.report";
    // CONNECT = 'producer.connect',
    // DISCONNECT = 'producer.disconnect',
    // REQUEST = 'producer.network.request',
    // REQUEST_TIMEOUT = 'producer.network.request_timeout',
    // REQUEST_QUEUE_SIZE = 'producer.network.request_queue_size',
})(ProducerEvents = exports.ProducerEvents || (exports.ProducerEvents = {}));
