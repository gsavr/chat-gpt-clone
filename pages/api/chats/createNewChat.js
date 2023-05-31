//runs in node environment

import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const { message } = req.body;
    const newUserMessage = {
      role: "user",
      content: message,
    };

    //connect to mongoDB to save in user's chat
    const client = await clientPromise;
    const db = client.db("ChattyAI");
    const chat = await db.collection("chats").insertOne({
      // Auth0 called user identifiers 'sub'
      userId: user.sub,
      messages: [newUserMessage],
      title: message,
    });
    //send chat back to client
    res.status(200).json({
      //mongoDB auto generated id needs to be converted to string
      _id: chat.insertedId.toString(),
      messages: [newUserMessage],
      title: message,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "An error ocurred when creating a new chat" });
    console.log("Error in CreateNewChat.js", e);
  }
}
