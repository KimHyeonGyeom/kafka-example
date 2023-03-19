import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      param: req.params,
      timestamp: new Date(),
    };

    await this.saveRequest(requestInfo);
    next();
  }

  async saveRequest(requestInfo: any) {
    const key = 'request-info';
    const value = JSON.stringify(requestInfo);
    await this.kafkaProducerService.sendMessage('topic', key, value);
  }
}
