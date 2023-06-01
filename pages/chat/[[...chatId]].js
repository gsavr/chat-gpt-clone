import { useEffect, useState } from "react";
import Head from "next/head";
import { getSession } from "@auth0/nextjs-auth0";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { ChatSideBar } from "components/ChatSidebar";
import { Footer } from "components/Footer/Footer";
import { Message } from "components/Message";
import { MessageForm } from "components/MessageForm";
import { ChatLanding } from "components/ChatLanding";
import { useRouter } from "next/router";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export default function ChatPage({ chatId, messages = [] }) {
  const [messageText, setMessagetext] = useState("");
  const [newChatId, setNewChatId] = useState(null);
  const [incomingResponse, setIncomingResponse] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [fullMessage, setFullMessage] = useState("");
  // used solely for routeHasChanged
  const [originalChatId, setOriginalChatId] = useState(chatId);
  const router = useRouter();
  // console.log(title, messages);
  // If route has changed we can stop the stream in new window
  const routeHasChanged = chatId !== originalChatId;

  //when we click through to a different chat, reset the following
  useEffect(() => {
    setChatMessages([]);
    setNewChatId(null);
  }, [chatId]);

  // save the newly streamed message to  chatMessages
  useEffect(() => {
    if (!routeHasChanged && !loadingResponse && fullMessage) {
      setChatMessages((prev) => [
        ...prev,
        {
          _id: uuid(),
          role: "asssitant",
          content: fullMessage,
        },
      ]);
      setFullMessage("");
    }
  }, [fullMessage, loadingResponse, routeHasChanged]);

  //route to 'chat/id' when new chat is started
  useEffect(() => {
    if (!loadingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, loadingResponse, router]);

  //aggregate all messages to display on chat window
  const allMessages = [...messages, ...chatMessages];

  const renderChatMessages = () => {
    return allMessages.map(({ _id, role, content }) => {
      return <Message key={_id} role={role} content={content} />;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingResponse(true);
    setOriginalChatId(chatId);

    // add role and id to the message being sent to chatty-ai and for MongoDB
    setChatMessages((prev) => {
      const chatMessages = [
        ...prev,
        {
          _id: uuid(),
          role: "user",
          content: messageText,
        },
      ];
      setMessagetext("");
      return chatMessages;
    });

    // send message and wait for response
    const response = await fetch("/api/chats/sendMessage", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ chatId, message: messageText }),
    });
    const data = response.body;
    if (!data) {
      return;
    }
    //read incoming message in chunks
    const reader = data.getReader();
    let content = "";
    await streamReader(reader, (message) => {
      //console.log("Message", message);

      //if new chat - set new chatId and store as a new convo
      if (message.event === "newChatId") {
        setNewChatId(message.content);
      } else {
        setIncomingResponse((s) => `${s}${message.content}`);
        //this will allow the incoming message to persist after the stream is over
        content += message.content;
      }
    });

    setFullMessage(content);
    setIncomingResponse("");
    setLoadingResponse(false);
  };

  return (
    <>
      <Head>
        <title>Chatty AI Chats</title>
      </Head>
      <div className="flex min-h-screen flex-col overflow-hidden bg-[#2D3748] text-white">
        <div className="flex min-h-screen">
          <ChatSideBar chatId={chatId} />
          <div id="main" className="flex flex-1 flex-col overflow-x-hidden">
            <div className="flex max-h-[88vh] flex-1 flex-col-reverse  justify-start overflow-scroll p-2">
              <div className="mb-auto">
                {/* area where messages are displayed */}
                {!chatMessages.length && !messages.length && <ChatLanding />}
              </div>
              <div className="mb-auto">
                {renderChatMessages()}
                {incomingResponse && !routeHasChanged && (
                  <Message role="assistant" content={incomingResponse} />
                )}

                {incomingResponse && routeHasChanged && (
                  <Message
                    role="notice"
                    content="Only ONE message allowed at a time, please wait until message is received. Your response may not have been recorded."
                  />
                )}
              </div>
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              loadingResponse={loadingResponse}
              messageText={messageText}
              setMessagetext={setMessagetext}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  //if user is not logged in -- redirect to '/'
  const session = await getSession(ctx.req, ctx.res);
  if (!session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  //get chatId from params in order to pass it as props
  const chatId = ctx.params?.chatId?.[0] || null;
  //console.log(chatId);
  if (chatId) {
    const { user } = session;
    const client = await clientPromise;
    const db = client.db("ChattyAI");
    const chat = await db.collection("chats").findOne({
      userId: user.sub,
      _id: new ObjectId(chatId),
    });
    return {
      props: {
        chatId,
        title: chat.title,
        messages: chat.messages.map((message) => ({
          ...message,
          // add a temp id since MongoDB does not store an id in the array
          _id: uuid(),
        })),
      },
    };
  }
  return {
    props: {},
  };
};
