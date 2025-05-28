import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Admin login
        if (credentials.userType === "admin") {
          if (credentials.username === "poyraz02" && credentials.password === "eliz02") {
            return {
              id: "admin",
              name: "Admin",
              email: "admin@company.com",
              role: "admin",
            }
          }
        }

        // Customer login
        if (credentials.userType === "customer") {
          const customers = [
            { id: "1", username: "customer1", password: "pass123", name: "Ahmet Yılmaz" },
            { id: "2", username: "customer2", password: "pass456", name: "Fatma Demir" },
          ]

          const customer = customers.find(
            (c) => c.username === credentials.username && c.password === credentials.password,
          )

          if (customer) {
            return {
              id: customer.id,
              name: customer.name,
              email: `${customer.username}@customer.com`,
              role: "customer",
            }
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: "your-secret-key-here",
})

export { handler as GET, handler as POST }
