import { json } from '@sveltejs/kit';
import { getClient } from '../../../lib/datebase';
import type { Client } from 'pg';

export async function POST({ request }) {
    const client: Client = getClient();
    const { amount, title } = await request.json();
    
    try {
        if (title == undefined) {
            await client.query("INSERT INTO money(amount) VALUES (" + amount + ");");
        } else {
            await client.query("INSERT INTO money(amount, title) VALUES (" + amount + ", '" + title + "');");
        }
        return json("OK");
    } catch (error) {
        return json(error);
    }
}