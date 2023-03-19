import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class KafkaProducerService {
  private producer;

  constructor(private kafkaService: KafkaService) {
    this.producer = this.kafkaService.getKafkaInstance().producer();
  }

  async sendMessage(topic: string, key: string, value: string): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic: topic,
      messages: [{ key: key, value: value }],
    });
    await this.producer.disconnect();
  }
}
