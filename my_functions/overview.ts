import { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import yahooFinance from "yahoo-finance2";
import { Quote } from "yahoo-finance2/api/modules/quote";

const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  const results: Quote[] = [];

  const securities = await prisma.security.findMany();
  await Promise.all(
    securities.map(async (security) => {
      const result = await yahooFinance.quoteCombine(security.ticker);

      results.push(result);
    })
  );

  return {
    statusCode: 200,
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      response_type: "in_channel",
      ...createOverviewBlock(results),
    }),
  };
};

export { handler };

function createOverviewBlock(quotes: Quote[]) {
  const total =
    quotes.length > 0
      ? (
          quotes.reduce((acc, q) => acc + q.regularMarketChangePercent!, 0) /
          quotes.length
        ).toFixed(3)
      : 0;
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Sköna Index",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Todays current profit *${total}%*`,
        },
      },
      {
        type: "divider",
      },
      ...quotes.map((q) => {
        return {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `*${q.symbol}* ${q.regularMarketChangePercent?.toFixed(
                3
              )}%`,
            },
          ],
        };
      }),
    ],
  };
}
