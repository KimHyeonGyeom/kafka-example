import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';
import { KafkaProducerService } from './kafka-producer.service';

@Module({
  providers: [KafkaProducerService, KafkaService],
  exports: [KafkaProducerService, KafkaService],
  controllers: [KafkaController],
})
export class KafkaModule {}
