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
    const {emetteur_id,receiver_id,message_text} = await request.json();

    if (!emetteur_id || !receiver_id || !message_text) {
      return new Response("Missing required fields", {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const { rowCount } = await sql`
      INSERT INTO messages (emetteur_id, receiver_id, message_text)
      VALUES (${emetteur_id}, ${receiver_id}, ${message_text})
    `;

    if(rowCount>0){
        console.log(rowCount+ " message inserted");
        return new Response("Message inserted successfully", {
            status: 200,
            headers: { "content-type": "application/json" },
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