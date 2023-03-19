import { Controller, Post, Body } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';

@Controller('request')
export class KafkaController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post()
  async handleRequest(@Body() requestBody: any): Promise<string> {
    const topic = 'topic';
    const key = requestBody.key;
    const value = JSON.stringify(requestBody);

    await this.kafkaProducerService.sendMessage(topic, key, value);
    console.log('Message sent to Kafka successfully!');
    return 'Message sent to Kafka successfully!';
  }
}
