import { Handler } from "@netlify/functions";
import qs from "querystring";
import { SlackPostMessage } from "./shared/types";
import { Command, parseTextToCommand } from "./shared/util";
import { handler as helpHandler } from "./help";
import { handler as addHandler } from "./add-security";
import { handler as deleteHandler } from "./delete-security";
import { handler as overviewHandler } from "./overview";

// @ts-ignore
const handler: Handler = async (event, context, cb) => {
  const slackData: SlackPostMessage = (qs.parse(
    event.body!
  ) as unknown) as SlackPostMessage;

  let command: Command;
  try {
    command = parseTextToCommand(slackData.text);
  } catch (err) {
    console.error(err, slackData.text);
    return {
      statusCode: 200,
      body:
        "failed to parse command, try typing /skonaindex help for available commands",
    };
  }

  switch (command) {
    case Command.OVERVIEW:
      return overviewHandler(event, context, cb);
    case Command.ADD:
      return addHandler(event, context, cb);
    case Command.DELETE:
      return deleteHandler(event, context, cb);
    case Command.HELP:
    default:
      return helpHandler(event, context, cb);
  }
};

export { handler };
