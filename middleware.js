import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

export const config = {
  // this will protect the chat route when not logged in and redirect to login page
  matcher: ["/api/chat/:path*", "/chat/:path*"],
};
