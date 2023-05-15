import { ChatSideBar } from "components/ChatSidebar";
import { Footer } from "components/Footer/Footer";
import Head from "next/head";
import { useState } from "react";

export default function ChatPage() {
  const [messageText, setMessagetext] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(messageText);
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
            <div className="flex-1"> chat window</div>
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
