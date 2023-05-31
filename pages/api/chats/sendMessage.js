//Edge function

import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { chatId: chatIdParams, message } = await req.json();
    let chatId = chatIdParams; //using alias since it can also be created in the createNewChat api endpoint

    const initialChatMessage = {
      role: "system",
      content:
        "Your name is Chatty AI. An incredibly intelligent and quick-thinking AI. That always replies with witty and energetic responses. You were created by Giorgio Savron. Your response must be formatted as markdown.",
    };

    //declare here in order to emit if it is new - if not then we do not send back to client
    let newChatId;

    if (chatId) {
      //add message to existing chat
      const response = await fetch(
        `${req.headers.get("origin")}/api/chats/addMessageToChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({
            chatId,
            role: "user",
            content: message,
          }),
        }
      );
    } else {
      //create new chat in the DB
      //origin is the domain
      const response = await fetch(
        `${req.headers.get("origin")}/api/chats/createNewChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            //cookie to reference that user is logged in since route is protected
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({
            message,
          }),
        }
      );
      const json = await response.json();
      //console.log("NEW CHAT", json);
      chatId = json._id;
      //console.log("chatId", chatId);
      newChatId = json._id;
    }

    //open the OPEN-AI stream
    const stream = await OpenAIEdgeStream(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [initialChatMessage, { content: message, role: "user" }],
          stream: true,
        }),
      },
      {
        //third argument passed to open ai
        //emit lets us emit one last message to client with one chunk of data
        onBeforeStream: ({ emit }) => {
          if (newChatId) emit(newChatId, "newChatId");
        },
        onAfterStream: async ({ fullContent }) => {
          await fetch(
            `${req.headers.get("origin")}/api/chats/addMessageToChat`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                cookie: req.headers.get("cookie"),
              },
              body: JSON.stringify({
                chatId,
                role: "assistant",
                content: fullContent,
              }),
            }
          );
        },
      }
    );
    return new Response(stream);
  } catch (e) {
    console.log("ERROR OCCURED IN SEND MESSAGE", e);
  }
}
