import { useState } from "react";
import Head from "next/head";
import { getSession } from "@auth0/nextjs-auth0";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { ChatSideBar } from "components/ChatSidebar";
import { Footer } from "components/Footer/Footer";
import { Message } from "components/Message";

export default function ChatPage() {
  const [messageText, setMessagetext] = useState("");
  const [incomingResponse, setIncomingResponse] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const renderChatMessages = () => {
    return chatMessages.map(({ _id, role, content }) => {
      return <Message key={_id} role={role} content={content} />;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
            <div className="bg-[#283141] p-5">
              <form onSubmit={handleSubmit}>
                <fieldset className="flex gap-2">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessagetext(e.target.value)}
                    placeholder="Send a message"
                    className="w-full resize-none rounded-md bg-[#3C4655] p-2 text-white focus:outline-slate-400"
                  />
                  <button className="btn" type="submit">
                    Send
                  </button>
                </fieldset>
              </form>
            </div>
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
