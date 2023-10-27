import { Kafka, Admin } from 'kafkajs';

export class KafkaTopicManager {
  private kafka: Kafka;
  private admin: Admin;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'auth',
      brokers: ['localhost:9092'],
    });
    this.admin = this.kafka.admin();
  }

  async createTopics(topicConfigs: Array<{ topic: string, numPartitions: number, replicationFactor: number }>) {
    const topics = await this.admin.listTopics();

    const topicList = topicConfigs.filter((config) => !topics.includes(config.topic));

    if (topicList.length) {
      await this.admin.createTopics({
        topics: topicList,
      });
    }

    console.log(topicList);
  }
}

