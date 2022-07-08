export enum ProducerEvents {
  READY = 'ready',
  CONNECTION_FAILURE = 'connection.failure',
  EVENT_LOG = 'event.log',
  EVENT_STATS = 'event.stats',
  EVENT_THROTTLE = 'event.throttle',
  EVENT_ERROR = 'event.error',
  DELIVERY_REPORT = 'delivery.report',
  // CONNECT = 'producer.connect',
  // DISCONNECT = 'producer.disconnect',
  // REQUEST = 'producer.network.request',
  // REQUEST_TIMEOUT = 'producer.network.request_timeout',
  // REQUEST_QUEUE_SIZE = 'producer.network.request_queue_size',
}
