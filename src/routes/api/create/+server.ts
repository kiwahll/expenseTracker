import { json } from '@sveltejs/kit';
import { getClient } from '../../../lib/datebase';
import type { Client } from 'pg';

export async function POST({ request }) {
    const client: Client = getClient();
    const { amount } = await request.json();
    
    try {
        await client.query("INSERT INTO money(amount) VALUES (" + amount + ");");
        return json("OK");
    } catch (error) {
        return json(error);
    }
}