import { sql } from "@vercel/postgres";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { rowCount, rows } = await sql`select * from rooms order by name`;
        console.log("Got " + rowCount + " rooms");
        if (rowCount === 0) {
            return new Response("[]", {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify(rows), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};
