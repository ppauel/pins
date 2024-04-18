import { PrismaClient } from "@prisma/client";
import {
  Client as DiscordClient,
  Events,
  GatewayIntentBits as Intents,
} from "discord.js";
import "dotenv/config";
import { chatCommand, contextMenu, onPin, onViewPins } from "./interaction";
import { deploy } from "./lib";

const prisma = new PrismaClient();

const client = new DiscordClient({
  intents: [Intents.DirectMessages, Intents.MessageContent],
});

client.on(Events.ClientReady, () => {
  console.log(`Connected to Discord Gateway as ${client.user?.tag}`);
  deploy(client).catch((e) => {
    console.error(`Could not register commands:`, e);
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isMessageContextMenuCommand()) {
    if (interaction.commandName === contextMenu.name) {
      await onPin(interaction, prisma).catch(console.error);
    }
  } else if (interaction.isChatInputCommand()) {
    if (interaction.commandName === chatCommand.name) {
      await onViewPins(interaction, prisma).catch(console.error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
