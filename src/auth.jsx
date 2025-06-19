import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      if (profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
      }

      console.log("JWT CALLBACK - token: ", token);  // 🔥 yaha print hoga

      return token;
    },

    async session({ session, token }) {
      session.idToken = token.idToken;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;

      console.log("SESSION CALLBACK - session: ", session); // 🔥 yaha print hoga

      return session;
    },
  },
});
