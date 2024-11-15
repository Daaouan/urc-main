import { db } from '@vercel/postgres';
import { kv } from "@vercel/kv";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) { 
    try {
        const client = await db.connect();

        const { rowCount, rows } = await client.query('SELECT user_id, username,last_login FROM users');

        if (rowCount === 0) {
            const error = { code: "NOT_FOUND", message: "Aucun utilisateur trouvé" };
            return new Response(JSON.stringify(error), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }

        const userList = rows.map(user => ({
            userId: user.user_id,
            username: user.username,
            last_login : user.last_login
        }));
        

        return new Response(JSON.stringify(userList), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ code: "INTERNAL_SERVER_ERROR", message: "Erreur interne du serveur" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
