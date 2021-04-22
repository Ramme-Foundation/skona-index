import { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { INVALID_BODY_MESSAGE } from "./add-security";
import { SlackPostMessage } from "./shared/types";
import { getTickerFromMessage } from "./shared/util";
import qs from "querystring";

const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  const slackData: SlackPostMessage = (qs.parse(
    event.body!
  ) as unknown) as SlackPostMessage;

  const ticker = getTickerFromMessage(slackData);

  if (!ticker) {
    return INVALID_BODY_MESSAGE;
  }

  try {
    const security = await prisma.security.delete({
      where: {
        ticker: ticker,
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        response_type: "in_channel",
        text: `deleted ticker ${ticker} by ${slackData.user_name}`,
      }),
    };
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return {
          statusCode: 200,
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ text: "invalid ticker" }),
        };
      }
    }
    throw e;
  }
};

export { handler };
