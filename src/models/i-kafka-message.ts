export type IKafkaMessage = {
    key: Buffer | null
    value: Buffer | null
    timestamp: string
    size: number
    attributes: number
    offset: string
    // headers?: IHeaders
  }

  export type IKafkaMessageHandler = {
    autoCommit?: boolean,
    autoCommitInterval?: number | null,
    autoCommitThreshold?: number | null,
    eachBatchAutoResolve?: boolean,
    partitionsConsumedConcurrently?: number,
    topic: string
    // eachBatch?: EachBatchHandler, 
    handler: (message: IKafkaMessage, partition: number)=> any
  }