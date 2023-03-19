import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import axios, { AxiosRequestConfig } from 'axios';
import { KAFKA_TOPIC } from '../constants/kafka.constants';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer;

  constructor(private readonly kafkaService: KafkaService) {
    this.consumer = this.kafkaService.getKafkaInstance().consumer({
      groupId: 'nestjs-kafka-group',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KAFKA_TOPIC,
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        const requestInfo = JSON.parse(message.value.toString());
        await this.performRequest(requestInfo);
        await heartbeat();
      },
    });
  }

  async performRequest(requestInfo: any) {
    try {
      const config: AxiosRequestConfig = {
        method: requestInfo.method,
        url: 'http://127.0.0.1:8080' + requestInfo.url,
        data: requestInfo.body,
      };

      const response = await axios(config);
      console.log(
        `Request performed: ${requestInfo.method} ${requestInfo.url}, status: ${
          response.status
        } response: ${JSON.stringify(response.data)}`,
      );
    } catch (error) {
      console.error(
        `Error performing request: ${requestInfo.method} ${requestInfo.url}`,
      );
      throw new Error(error);
    }
  }
}
