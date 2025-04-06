import pkg from 'pg';
const { Client } = pkg;

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
			.then(async () => {
				await client.query("CREATE TABLE IF NOT EXISTS money (id SERIAL PRIMARY KEY, amount NUMERIC NOT NULL, title VARCHAR(255), date DATE NOT NULL);");
				console.log("Connected to Database!");
			})
			.catch(err => console.error('Connection error', err.stack));
	}

	return client;
};
