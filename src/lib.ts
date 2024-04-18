import {
  Client,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { chatCommand, contextMenu } from "./interaction";

// User Installed App Command Object Workaround (since discord.js does not support it yet)
export function onlyInDMs(
  jsonBody:
    | RESTPostAPIContextMenuApplicationCommandsJSONBody
    | RESTPostAPIChatInputApplicationCommandsJSONBody,
) {
  return {
    integration_types: [1],
    contexts: [2],
    ...jsonBody,
  };
}

// User Installed App Command Deploy Workaround (since discord.js does not support it yet)
export async function deploy(client: Client) {
  const rest = new REST().setToken(client.token!);

  return rest.put(Routes.applicationCommands(client.user!.id), {
    body: [onlyInDMs(chatCommand.toJSON()), onlyInDMs(contextMenu.toJSON())],
  });
}

// Format relative Discord date
export function rDate(timestamp: bigint) {
  const strippedTime = Math.floor(Number(timestamp / BigInt(1000)));
  return `<t:${strippedTime}:R>`;
}
