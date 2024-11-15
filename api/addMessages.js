import { kv } from "@vercel/kv";
import { db } from "@vercel/postgres";
import beamsClient from "../lib/pusherConfig.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { senderId, receiverId, senderName, messageContent } = req.body;

    const conversationKey = `conversations:${senderId}:${receiverId}`;
    const timestamp = new Date().toISOString();

    const newMessage = {
      senderId: senderId,
      receiverId: receiverId,
      senderName: senderName,
      messageContent: messageContent,
      timestamp: timestamp,
    };

    // Add the new message to the conversation in Vercel KV
    await kv.lpush(conversationKey, newMessage);

    // Get the external_id of the receiver
    const client = await db.connect();
    const query = `SELECT external_id FROM users WHERE user_id=$1`;
    const { rows } = await client.query(query, [receiverId]);
    client.release();

    if (!rows.length) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const { external_id: externalId } = rows[0];
    console.log(externalId);
    

    // Send a notification to the receiver
    await sendNotification(
      [externalId],
      `You got a new message from ${senderName}`,
      messageContent
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendNotification(userIds, title, message) {
  try {
    const response = await beamsClient.publishToUsers(userIds, {
        web: {
          notification: {
            title: title,
            body: message,
            deep_link: 'http://localhost:3001/messages',

          },
      },
    });
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
