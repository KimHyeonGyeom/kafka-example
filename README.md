
# Nest.js를 활용하여 클라이언트의 요청을 Kafka 큐로 전송하여 서버와 통신하는 프로세스 구축  
    

이 문서에서는 Nest.js를 활용하여 클라이언트의 요청을 Kafka 큐로 전송하고, 서버와 통신하는 프로세스를 구축하는 방법을 설명합니다.

## 프로젝트 구조
<p align="center">
  <a target="blank"><img src="https://i.postimg.cc/63k6Vg0Z/5.png" /></a>
</p>




## Kafka 컨슈머 생성

```bash
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
```
이 코드는 Kafka 컨슈머 서비스를 구현한 것입니다. Kafka 컨슈머 서비스는 Kafka 큐에 저장된 메시지를 가져와 처리하는 역할을 합니다.   
코드는 다음과 같이 구성되어 있습니다.

KafkaConsumerService 클래스를 정의하고, OnModuleInit 인터페이스를 구현했습니다.  
kafkaService로 부터 Kafka 인스턴스를 가져와 사용합니다.
onModuleInit 메서드를 통해 모듈 초기화 시 consumer를 연결하고, 주어진 토픽에 대해 구독을 시작합니다. 이때, 큐의 처음부터 메시지를 처리하기 위해 fromBeginning 옵션을 사용합니다.  

메시지의 value를 JSON 형태로 파싱하고, performRequest 메서드를 사용하여 서버 api에 axios를 사용하여 요청을 보내고 응답을 받습니다.

## Kafka 프로듀서 생성


```bash
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
```
이 코드는 Kafka 프로듀서 서비스를 구현한 것입니다. Kafka 프로듀서 서비스는 메시지를 생성하여 Kafka에 전송하는 역할을 합니다.   
코드는 다음과 같이 구성되어 있습니다.

KafkaProducerService 클래스를 정의하고, 클래스 내에서 Kafka 프로듀서 인스턴스를 생성합니다.  
sendMessage 메서드를 통해 주어진 topic, key, value를 가진 메시지를 생성하고, Kafka에 전송합니다. 

## 참고

- KafkaJS - [KafkaJS](https://kafka.js.org/docs/configuration#restartonfailure)