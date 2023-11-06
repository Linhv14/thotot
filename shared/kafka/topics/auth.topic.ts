export const authTopicsToCreate = [
    {
      topic: 'auth.register',
      numPartitions: 3,
      replicationFactor: 1,
    },
    {
      topic: 'auth.register.reply',
      numPartitions: 3,
      replicationFactor: 1,
    },
    {
      topic: 'auth.login',
      numPartitions: 3,
      replicationFactor: 1,
    },
    {
      topic: 'auth.login.reply',
      numPartitions: 3,
      replicationFactor: 1,
    },
    {
      topic: 'auth.validate',
      numPartitions: 3,
      replicationFactor: 1,
    },
    {
      topic: 'auth.validate.reply',
      numPartitions: 3,
      replicationFactor: 1,
    },
    {
      topic: 'auth.verify',
      numPartitions: 3,
      replicationFactor: 1,
    },
    {
      topic: 'auth.verify.reply',
      numPartitions: 3,
      replicationFactor: 1,
    },
  ];