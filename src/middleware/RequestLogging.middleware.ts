import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 요청 정보를 수집합니다.
    const requestInfo = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      timestamp: new Date(),
    };

    // 요청 정보를 저장합니다. 예를 들어, 데이터베이스, 파일 시스템, 외부 서비스 등을 사용할 수 있습니다.
    await this.saveRequest(requestInfo);

    next();
  }

  async saveRequest(requestInfo: any) {
    // 이 함수에서 요청 정보를 원하는 방식으로 저장합니다.
    const key = 'request-info'; // 필요한 경우 적절한 키를 사용하세요.
    const value = JSON.stringify(requestInfo);
    await this.kafkaProducerService.sendMessage('topic', key, value);
  }
}
