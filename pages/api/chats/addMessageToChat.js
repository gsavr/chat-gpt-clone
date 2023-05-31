import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("ChattyAI");

    const { chatId, role, content } = req.body;

    const chat = await db.collection("chats").findOneAndUpdate(
      {
        //-- search criteria --
        //convert chatId back to mongoDB Object
        _id: new ObjectId(chatId),
        //so you can only update a chat belonging to you
        userId: user.sub,
      },
      {
        //-- operation you want executed
        $push: {
          messages: {
            role,
            content,
          },
        },
      },
      {
        //-- 3rd argument -- once done, ask mongoDB to return the document
        returnDocument: "after",
      }
    );

    res.status(200).json({
      chat: {
        ...chat.value,
        _id: chat.value._id.toString(),
      },
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error occurred when adding a message to chat" });
  }
}
