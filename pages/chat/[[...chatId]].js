import { useState } from "react";
import Head from "next/head";
import { getSession } from "@auth0/nextjs-auth0";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { ChatSideBar } from "components/ChatSidebar";
import { Footer } from "components/Footer/Footer";
import { Message } from "components/Message";
import { MessageForm } from "components/MessageForm";

export default function ChatPage() {
  const [messageText, setMessagetext] = useState("");
  const [incomingResponse, setIncomingResponse] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingResponse, setLoadingResponse] = useState(false);

  const renderChatMessages = () => {
    return chatMessages.map(({ _id, role, content }) => {
      return <Message key={_id} role={role} content={content} />;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingResponse(true);

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

    const response = await fetch("/api/chats/sendMessage", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    });
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    await streamReader(reader, (message) => {
      //console.log("Message", message);
      setIncomingResponse((s) => `${s}${message.content}`);
    });
    setLoadingResponse(false);
  };

  return (
    <>
      <Head>
        <title>Chatty AI Chats</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-[#2D3748] text-white ">
        <div className="flex h-[95vh]">
          <ChatSideBar />
          <div id="main" className="flex flex-1 flex-col overflow-auto ">
            <div className="flex-1 p-2">
              {renderChatMessages()}
              {incomingResponse && (
                <Message role="assistant" content={incomingResponse} />
              )}
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
  const session = await getSession(ctx.req, ctx.res);
  if (!session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
};
