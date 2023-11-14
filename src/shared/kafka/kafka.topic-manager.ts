import { Kafka, Admin } from 'kafkajs';

export class KafkaTopicManager {
  private kafka: Kafka;
  private admin: Admin;

  constructor(clientId: string, brokers: string[]) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
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

