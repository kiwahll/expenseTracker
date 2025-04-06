import { json } from '@sveltejs/kit';
import { getClient } from '../../../lib/datebase';
import type { Client } from 'pg';

export async function POST({ request }) {
    const client: Client = getClient();
    const { id } = await request.json();
    
    try {
        await client.query("DELETE FROM money WHERE id = " + id + ";");
        return json("OK");
    } catch (error) {
        return json(error);
    }
}