import { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(helpBlock),
  };
};

export { handler };

const helpBlock = {
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Sköna Index helper",
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "*overview* print index performance",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "*delete <ticker>* delete ticker to index",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "*add <ticker>* add ticker to index. (use Yahoo Finance id)",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "*help* print help commands",
        },
      ],
    },
  ],
};
