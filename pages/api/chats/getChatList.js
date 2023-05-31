// runs in node env

import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("ChattyAI");

    const chats = await db
      .collection("chats")
      .find(
        {
          userId: user.sub,
        },
        {
          projection: {
            //projection tells mongoDB NOT to send these properties back
            userId: 0,
            messages: 0,
          },
        }
      )
      .sort({
        // id's in mongoDB are based on timestamps, so we will sort from newest to oldest
        _id: -1,
      })
      .toArray();
    //return the reposnse as an array
    res.status(200).json({ chats });
  } catch (e) {
    res
      .status(500)
      .json({ message: "An error occured when getting the chat list" });
  }
}
