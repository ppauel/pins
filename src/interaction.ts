import { PrismaClient } from "@prisma/client";
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  bold,
  messageLink,
  quote,
} from "discord.js";
import { rDate } from "./lib";

// Context Menu Builder
export const contextMenu = new ContextMenuCommandBuilder()
  .setName("Pin")
  .setType(ApplicationCommandType.Message)
  .setDMPermission(true);

// Slash Command Builder
export const chatCommand = new SlashCommandBuilder()
  .setName("pins")
  .setDescription("View all pinned messages in this channel")
  .setDMPermission(true);

// Pin Interaction
export const onPin = async (
  interaction: MessageContextMenuCommandInteraction,
  prisma: PrismaClient,
) => {
  const { user, channelId, targetMessage } = interaction;
  const { author, content, createdTimestamp } = targetMessage;
  const hasAttachment = targetMessage.attachments.size > 0;

  const alreadyPinned = await prisma.message
    .count({
      where: {
        id: targetMessage.id,
        context: channelId,
      },
    })
    .then((c) => c > 0);

  if (alreadyPinned) {
    interaction.reply({
      ephemeral: true,
      content: `This message is already pinned.`,
    });
    return;
  }

  prisma.message
    .create({
      data: {
        authorId: author.id,
        authorName: author.username,
        content: content || "",
        context: channelId,
        date: createdTimestamp,
        id: targetMessage.id,
        hasAttachment: hasAttachment,
      },
    })
    .then(() => {
      interaction
        .reply({
          content: `${user} pinned [a message](${targetMessage.url}) by ${author} to this channel.`,
        })
        .catch(console.error);
    })
    .catch((e) => {
      console.error(e);
      interaction
        .reply({
          ephemeral: true,
          content: `An error occured, please try again.`,
        })
        .catch(console.error);
    });
};

// View Pins Interaction
export const onViewPins = async (
  interaction: ChatInputCommandInteraction,
  prisma: PrismaClient,
) => {
  const { channelId } = interaction;
  const pins = (
    await prisma.message.findMany({
      where: {
        context: channelId,
      },
      orderBy: {
        date: "desc",
      },
    })
  ).map((pin) => {
    return `${bold(pin.authorName)} ${rDate(pin.date)}:\n${quote(`[${pin.hasAttachment ? "📎️" : ""} ${pin.content.length ? pin.content : "No content"}](${messageLink(channelId, pin.id)})`)}`;
  });

  interaction
    .reply({
      ephemeral: true,
      content: pins.length
        ? pins.join(`\n\n`)
        : `No pinned messages in this channel. Use the \`Pin\` message context menu in order to pin your first message!`,
    })
    .catch(console.error);
};
