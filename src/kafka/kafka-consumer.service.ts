import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer;

  constructor(private readonly kafkaService: KafkaService) {
    this.consumer = this.kafkaService
      .getKafkaInstance()
      .consumer({ groupId: 'nestjs-kafka-group' });
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'topic',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value.toString()}`);
      },
    });
  }
}
