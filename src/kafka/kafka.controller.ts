import { Controller, Post, Body } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { KAFKA_TOPIC } from '../constants/kafka.constants';

@Controller('request')
export class KafkaController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post()
  async handleRequest(@Body() requestBody: any): Promise<string> {
    const topic = KAFKA_TOPIC;
    const key = requestBody.key;
    const value = JSON.stringify(requestBody);

    await this.kafkaProducerService.sendMessage(topic, key, value);
    return 'Message sent to Kafka successfully!';
  }
}
