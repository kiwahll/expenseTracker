import { json } from '@sveltejs/kit';
import { getClient } from '../../../lib/datebase';
import type { Client } from 'pg';

export async function GET() {
    const client: Client = getClient();

    try {
        const result = await client.query("SELECT * FROM money");
        return json(result.rows);
    } catch (error) {
        return json(error);
    }
}