import Link from "next/link";

export const ChatSideBar = () => {
  return (
    <div
      className={`mobile-menu flex w-full flex-col justify-between overflow-auto bg-[#3C4655]  transition-all duration-200 md:w-1/3 lg:flex lg:w-1/5 `}
    >
      <div className="flex flex-1">Chat Sidebar</div>
      <Link href="/api/auth/logout">Logout</Link>
    </div>
  );
};
