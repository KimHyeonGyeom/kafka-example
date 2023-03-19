import { Kafka, logLevel } from 'kafkajs';

export class KafkaService {
  private readonly kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-kafka-client',
      brokers: ['localhost:9092'],
      retry: {
        initialRetryTime: 3000,
        retries: 10,
      },
      logLevel: logLevel.INFO,
    });
  }

  getKafkaInstance(): Kafka {
    return this.kafka;
  }
}
