import { kv } from "@vercel/kv";
import { db } from "@vercel/postgres";
import beamsClient from "../lib/pusherConfig.js";
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Ensure FormData parsing is correct
    const data = req.body; // Use this if req.body contains parsed data directly
    const { senderId, receiverId, senderName, messageContent } = JSON.parse(data.message);

    if (!senderId || !receiverId || !senderName || !messageContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle file upload if present
    let filePath = null;
    if (data.file) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      const buffer = Buffer.from(data.file);
      filePath = path.join(uploadDir, `${Date.now()}-${senderId}-${receiverId}`);
      fs.writeFileSync(filePath, buffer);
    }

    const conversationKey = `conversations:${senderId}:${receiverId}`;
    const timestamp = new Date().toISOString();
    const newMessage = {
      senderId,
      receiverId,
      senderName,
      messageContent,
      timestamp,
      filePath: filePath ? `/uploads/${path.basename(filePath)}` : null,
    };

    // Add to KV
    await kv.lpush(conversationKey, newMessage);

    // Fetch receiver's external_id
    const client = await db.connect();
    const query = `SELECT external_id FROM users WHERE user_id=$1`;
    const { rows } = await client.query(query, [receiverId]);
    client.release();

    if (!rows.length) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const { external_id: externalId } = rows[0];
    await sendNotification(
      [externalId],
      `New message from ${senderName}`,
      messageContent
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendNotification(userIds, title, message) {
  try {
    const response = await beamsClient.publishToUsers(userIds, {
      web: {
        notification: {
          title,
          body: message,
          deep_link: 'http://localhost:3000/messages',
        },
      },
    });
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Notification error:", error);
  }
}
