import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaProducerService } from './kafka/kafka-producer.service';
import { KafkaController } from './kafka/kafka.controller';
import { KafkaConsumerService } from './kafka/kafka-consumer.service';

@Module({
  imports: [KafkaModule],
  controllers: [AppController, KafkaController],
  providers: [AppService, KafkaProducerService, KafkaConsumerService],
})
export class AppModule {}
