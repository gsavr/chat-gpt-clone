import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faPlusCircle,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export const ChatSideBar = ({ chatId }) => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const loadChatList = async () => {
      const response = await fetch("/api/chats/getChatList", {
        method: "POST",
      });
      const json = await response.json();
      //console.log("CHAT LIST ", json);
      setChatList(json?.chats || []);
    };
    loadChatList();
  }, [chatId]);

  const renderChatList = () => {
    return chatList.map(({ _id, title }) => {
      return (
        <Link
          key={_id}
          href={`/chat/${_id}`}
          className={`side-menu-item ${chatId === _id && "bg-[#3C4655]"}`}
        >
          <FontAwesomeIcon icon={faComment} height={25} />{" "}
          <span
            title={title}
            className="overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {title}
          </span>
        </Link>
      );
    });
  };

  return (
    <div
      className={`mobile-menu  flex w-full flex-col justify-between overflow-hidden bg-[#3C4655] transition-all duration-200 md:w-1/3 lg:flex lg:w-1/5 `}
    >
      <div className="bg-[#101318]">
        <Link
          href="/chat"
          className="side-menu-item m-2 bg-[#C1BE46] text-black hover:bg-gray-200"
        >
          <FontAwesomeIcon icon={faPlusCircle} height={25} /> New Chat
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-auto bg-[#101318]">
        {renderChatList()}
      </div>
      <Link href="/api/auth/logout" className="side-menu-item">
        <FontAwesomeIcon icon={faRightFromBracket} height={25} /> Logout
      </Link>
    </div>
  );
};
