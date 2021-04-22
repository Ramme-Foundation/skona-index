import { SlackPostMessage } from "./types";

export enum Command {
  HELP = "HELP",
  ADD = "ADD",
  OVERVIEW = "OVERVIEW",
  DELETE = "DELETE",
}

export const parseTextToCommand = (message: string): Command => {
  const split = message.trimEnd().split(" ");
  const parsedCommand: Command | undefined = (<any>Command)[
    split[0].toUpperCase()
  ];
  console.log(parsedCommand);
  if (parsedCommand === undefined) {
    throw new Error("unknown command");
  }
  return parsedCommand;
};

export function getTickerFromMessage(slackData: SlackPostMessage) {
  return slackData.text.split(" ")[1];
}
