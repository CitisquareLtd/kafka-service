/// <reference types="node" />
export declare type IKafkaMessage = {
    key: Buffer | null;
    value: Buffer | null;
    timestamp: string;
    size: number;
    attributes: number;
    offset: string;
};
export declare type IKafkaMessageHandler = {
    autoCommit?: boolean;
    autoCommitInterval?: number | null;
    autoCommitThreshold?: number | null;
    eachBatchAutoResolve?: boolean;
    partitionsConsumedConcurrently?: number;
    topic: string;
    handler: (message: IKafkaMessage, partition: number) => any;
};
