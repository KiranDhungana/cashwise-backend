import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { prisma } from "./prismaClient";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    // "https://cashwise-uzly.vercel.app",
    credentials: true, // if using cookies or sessions
  })
);

// health-check
app.get("/", (_req, res) => {
  res.send("OK");
});
// auth
app.use("/api/auth", authRoutes);

// graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
      "PLAID-SECRET": process.env.PLAID_SECRET!,
    },
  },
});
const plaidClient = new PlaidApi(configuration);
const products = [
  "auth", // Authentication product
  "transactions", // Transactions product
];

app.post("/api/create_link_token", async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "user-id",
      },
      client_name: "Your App Name",
      products: products as any,
      country_codes: ["US"] as any,
      language: "en",
    });
    res.json({ link_token: response.data.link_token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Route to exchange public token for access token
app.post("/api/exchange_public_token", async (req, res) => {
  const { public_token } = req.body;

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const access_token = response.data.access_token;
    const item_id = response.data.item_id;

    res.json({ access_token, item_id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/get_user_data", async (req, res) => {
  const { access_token } = req.body;
  console.log("test");
  try {
    // Fetch transactions
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token,
      start_date: "2022-01-01",
      end_date: "2024-12-31",
    });

    // Fetch account balances
    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token,
    });

    // Combine data
    const combinedData = {
      transactions: transactionsResponse.data.transactions,
      accounts: balanceResponse.data.accounts,
    };

    res.json(combinedData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
