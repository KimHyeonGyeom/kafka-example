import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

export class KafkaService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-kafka-client',
      brokers: ['localhost:9092'],
      logLevel: logLevel.ERROR,
    });
  }

  getKafkaInstance(): Kafka {
    return this.kafka;
  }
}
