"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerEvents = void 0;
var ProducerEvents;
(function (ProducerEvents) {
    ProducerEvents["CONNECT"] = "producer.connect";
    ProducerEvents["DISCONNECT"] = "producer.disconnect";
    ProducerEvents["REQUEST"] = "producer.network.request";
    ProducerEvents["REQUEST_TIMEOUT"] = "producer.network.request_timeout";
    ProducerEvents["REQUEST_QUEUE_SIZE"] = "producer.network.request_queue_size";
})(ProducerEvents = exports.ProducerEvents || (exports.ProducerEvents = {}));
