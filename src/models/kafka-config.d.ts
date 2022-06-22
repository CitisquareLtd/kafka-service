import { ISsalConfig } from './ssal-config';
export interface IKafKaConfig {
    brokers: string[];
    groupID: string;
    clientId: string;
    ssal?: ISsalConfig;
}
