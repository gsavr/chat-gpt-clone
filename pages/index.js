import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import logo from "../images/ai-logo.png";
import { getSession } from "@auth0/nextjs-auth0";
import { Footer } from "components/Footer/Footer";

export default function Home() {
  const { isLoading, error, user } = useUser();

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>Chatty AI</title>
      </Head>
      {isLoading ? (
        <div> Loading...</div>
      ) : (
        <div className="flex min-h-screen w-full flex-col bg-[#2D3748] text-center text-white">
          <div className="flex h-[95vh] w-full flex-col items-center justify-center text-center ">
            <Image src={logo} width={70} alt="logo" />
            <h1>Chatty AI</h1>
            <div>
              <div>
                <Link className="btn" href="/api/auth/login">
                  Login
                </Link>
                <Link className="btn" href="/api/auth/signup">
                  signup
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res);
  if (!!session) {
    return {
      redirect: {
        destination: "/chat",
      },
    };
  }
  return {
    props: {},
  };
};
