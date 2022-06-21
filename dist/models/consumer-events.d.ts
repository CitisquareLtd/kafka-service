export declare enum ConsumerEvents {
    HEARTBEAT = "consumer.heartbeat",
    COMMIT_OFFSETS = "consumer.commit_offsets",
    GROUP_JOIN = "consumer.group_join",
    FETCH_START = "consumer.fetch_start",
    FETCH = "consumer.fetch",
    START_BATCH_PROCESS = "consumer.start_batch_process",
    END_BATCH_PROCESS = "consumer.end_batch_process",
    CONNECT = "consumer.connect",
    DISCONNECT = "consumer.disconnect",
    STOP = "consumer.stop",
    CRASH = "consumer.crash",
    REBALANCING = "consumer.rebalancing",
    RECEIVED_UNSUBSCRIBED_TOPICS = "consumer.received_unsubscribed_topics",
    REQUEST = "consumer.network.request",
    REQUEST_TIMEOUT = "consumer.network.request_timeout",
    REQUEST_QUEUE_SIZE = "consumer.network.request_queue_size"
}
