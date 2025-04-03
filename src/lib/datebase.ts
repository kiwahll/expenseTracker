import pkg from 'pg';
const {Client} = pkg;

let client: Client;

export const getClient = (): Client => {
  if (!client) {
    client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'moneytracker',
      password: 'postgres',
      port: 5432,
    });

    client.connect()
      .then(() => console.log('Connected to PostgreSQL'))
      .catch(err => console.error('Connection error', err.stack));
  }

  return client;
};
