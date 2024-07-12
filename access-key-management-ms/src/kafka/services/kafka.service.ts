import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { kafkaEvents } from 'src/enums/event.enum';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('kafkaClientId'),
      brokers: [this.configService.get<string>('kafkaBroker')],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      await this.producer.connect();
      console.log('Connected to Kafka');
    } catch (error) {
      console.error('Error connecting to Kafka:', error);
      // Implement retry logic or error handling as needed
      await this.retryConnection();
    }
  }

  private async retryConnection() {
    // Implement retry logic with exponential backoff
    let attempt = 1;
    while (attempt <= 5) {
      try {
        console.log(`Attempting to reconnect to Kafka (attempt ${attempt})...`);
        await this.producer.connect();
        console.log('Reconnected to Kafka');
        return;
      } catch (error) {
        console.error(`Failed to reconnect to Kafka (attempt ${attempt}):`, error);
        await this.sleep(1000 * Math.pow(2, attempt)); // Exponential backoff
        attempt++;
      }
    }
    console.error('Could not reconnect to Kafka after multiple attempts.');
    // Handle failure scenario, possibly throw an error or perform fallback action
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendMessage(topic: kafkaEvents, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      console.log(`Message sent to topic ${topic}`);
    } catch (error) {
      console.error(`Failed to send message to topic ${topic}:`, error);
      await this.retrySendMessage(topic, message);
    }
  }

  private async retrySendMessage(topic: kafkaEvents, message: any) {
    let attempt = 1;
    while (attempt <= 5) {
      try {
        console.log(`Retrying to send message to topic ${topic} (attempt ${attempt})...`);
        await this.producer.send({
          topic,
          messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Message sent to topic ${topic} on retry attempt ${attempt}`);
        return;
      } catch (error) {
        console.error(`Failed to send message to topic ${topic} on retry attempt ${attempt}:`, error);
        await this.sleep(1000 * Math.pow(2, attempt)); // Exponential backoff
        attempt++;
      }
    }
    console.error(`Could not send message to topic ${topic} after multiple attempts.`);
    // Handle failure scenario, possibly throw an error or perform fallback action
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('Disconnected from Kafka');
  }
}
