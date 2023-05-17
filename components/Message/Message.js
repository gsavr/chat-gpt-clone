import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import aiAvatar from "../../images/ai-avatar.png";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const Message = ({ role, content }) => {
  const { user } = useUser();

  return (
    <div
      className={`flex gap-5 p-4 ${
        role === "assistant" ? "rounded-sm bg-[#3C4655]" : ""
      } `}
    >
      <div className="flex h-[30px] w-[30px]">
        {/* when user is talking and there is a user  */}
        {role === "user" && !!user ? (
          <Image
            src={user.picture}
            width={30}
            height={30}
            alt="user_avatar"
            className="rounded-full shadow-md shadow-black/50"
          />
        ) : (
          <Image
            src={aiAvatar}
            width={30}
            height={30}
            alt="ai_avatar"
            className="rounded-full shadow-md shadow-black/50"
          />
        )}
      </div>
      {/* prose is part of tailwind css typography */}
      <div className="prose prose-invert flex flex-1">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
