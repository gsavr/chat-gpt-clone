import Image from "next/image";
import logo from "../../images/ai-avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal, faMicrochip } from "@fortawesome/free-solid-svg-icons";

export const ChatLanding = () => {
  return (
    <div className="flex flex-col items-center pt-2 text-center">
      <Image
        src={logo}
        alt="chatty-ai"
        height={100}
        width={100}
        className="rounded-full shadow-md shadow-black"
      />
      <h1>Chatty AI</h1>
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-lg bg-[#3C4655] px-16 shadow-md md:px-20">
          <div className="flex items-center gap-2 md:gap-6">
            <FontAwesomeIcon
              icon={faTerminal}
              fade
              className="h-6 w-6 text-xl text-[#BFBE44]"
            />
            <h5 className="text-base md:text-lg"> What can you ask me?</h5>
          </div>
          <div className="text-sm md:text-base">
            <ul>
              <li>What is your name?</li>
              <li>Who made you?</li>
              <li>What tasks can you do?</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg bg-[#3C4655] px-12 shadow-md md:px-16">
          <div className="flex items-center gap-2 md:gap-6">
            <FontAwesomeIcon
              icon={faMicrochip}
              className="h-6 w-6 text-xl text-[#BFBE44]"
            />
            <h5 className="text-base md:text-lg"> What am I capable of?</h5>
          </div>
          <div className="text-sm md:text-base">
            <ul>
              <li>I can save our conversations</li>
              <li>I can respond to follow up corrections</li>
              <li>I am trained on most data up to 2021</li>
            </ul>
          </div>
        </div>

        <div className="text-xs">
          Chatty-AI may produce inaccurate information about people, places, or
          facts.
        </div>
      </div>
    </div>
  );
};
