import { sql } from "@vercel/postgres";
import { checkSession, unauthorizedResponse } from "../lib/session";

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  try {
    const connected = await checkSession(request);
    if (!connected) {
      console.log("Not connected");
      return unauthorizedResponse();
    }
    const { sender_id, receiver_id } = await request.json();

    if (!sender_id || !receiver_id) {
      return new Response("Missing required fields", {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const { rowCount, rows } = await sql`
    SELECT
    message_id,
    emetteur_id AS sender_id,  -- Rename emetteur_id to sender_id for consistency
    recepteur_id AS receiver_id,  -- Rename recepteur_id to receiver_id for consistency
    contenu AS message_text,  -- Replace message_text with contenu
    TO_CHAR(created_on, 'DD/MM/YYYY HH24:MI') as timestamp  -- Replace timestamp with created_on
    FROM
        messages
    WHERE
        (emetteur_id = ${sender_id} AND recepteur_id = ${receiver_id})
        OR
        (emetteur_id = ${receiver_id} AND recepteur_id = ${sender_id})
    ORDER BY
        created_on ASC;  -- Order by created_on instead of timestamp
`;



    if (rowCount === 0) {
      /* Vercel bug doesn't allow 204 response status */
      return new Response("[]", {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    else {
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
  }
  catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}