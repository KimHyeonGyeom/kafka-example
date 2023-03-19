import { Controller, Get, Request } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';

@Controller('request')
export class KafkaController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Get()
  async handleRequest(@Request() req): Promise<string> {
    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      param: req.params,
      timestamp: new Date(),
    };

    const key = 'request-info';
    const value = JSON.stringify(requestInfo);
    await this.kafkaProducerService.sendMessage('topic', key, value);

    return 'Message sent to Kafka successfully!';
  }
}
