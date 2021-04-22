import { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import { get } from "lodash";
import yahooFinance from "yahoo-finance2";
import { SlackPostMessage } from "./shared/types";
import qs from "querystring";
import { getTickerFromMessage } from "./shared/util";

const prisma = new PrismaClient();

export const INVALID_BODY_MESSAGE = {
  statusCode: 200,
  headers: {
    "Content-type": "application/json",
  },
  body: JSON.stringify({ text: "Invalid body" }),
};

interface AddSecurityRequest {
  ticker?: string;
}

const handler: Handler = async (event, context) => {
  const slackData: SlackPostMessage = (qs.parse(
    event.body!
  ) as unknown) as SlackPostMessage;

  const ticker = getTickerFromMessage(slackData);

  if (!ticker) {
    return INVALID_BODY_MESSAGE;
  }

  const results = await yahooFinance.search(ticker);
  const validTicker = get(results, "quotes[0].symbol", false);
  if (!validTicker) {
    console.log("Could not find ticker", validTicker);
    return {
      statusCode: 200,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        response_type: "in_channel",
        text: "invalid ticker",
      }),
    };
  }

  const security = await prisma.security.create({
    data: {
      ticker: validTicker,
    },
  });

  return {
    statusCode: 200,
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      text: `added ticker ${validTicker} by ${slackData.user_name}`,
    }),
  };
};

export { handler };
