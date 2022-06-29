import { IAudit } from './i-audit';
import { IMessage } from './i-message';
export declare type IKafkaMessage = {
    key: String | null;
    value: IMessage | IAudit;
    timestamp: string;
    size: number;
    attributes: number;
    offset: string;
};
export interface IKafkaMessageHandler {
    autoCommit?: boolean;
    autoCommitInterval?: number | null;
    autoCommitThreshold?: number | null;
    eachBatchAutoResolve?: boolean;
    partitionsConsumedConcurrently?: number;
    topic: string;
    handler: (message: IKafkaMessage, partition: number) => any;
}
