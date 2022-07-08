import { ISsalConfig } from './ssal-config';
export interface IKafKaConfig {
    brokers: string[];
    groupID: string;
    clientId: string;
    sasl?: ISsalConfig;
    ssl?: {
        ca: string;
    };
}
