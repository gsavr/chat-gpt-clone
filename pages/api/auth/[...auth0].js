import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  //pass function to create route to sign up
  signup: handleLogin({ authorizationParams: { screen_hint: "signup" } }),
});
