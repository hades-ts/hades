import { HadesClient } from "@hades-ts/core";
import {
    arg,
    command,
    guildCommand,
    SlashCommand,
} from "@hades-ts/slash-commands";
import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    type GuildMember,
    type ThreadChannel,
} from "discord.js";
import { inject } from "inversify";
import { GlobalQuotaError, UserQuotaError } from "../errors";
import type { Thread, ThreadMessage } from "../types";

@guildCommand("explain", { description: "Ask the bot a question." })
export class ExplainCommand extends SlashCommand {
    @arg({
        description: "Your question.",
        type: ApplicationCommandOptionType.String,
    })
    question!: string;

    @inject(HadesClient)
    protected client!: HadesClient;

    protected async reject(content: string) {
        await this.interaction.deferReply({
            ephemeral: true,
        });
        await this.interaction.editReply({
            content,
        });
    }

    async execute(): Promise<void> {
        // if (this.interaction.channel!.type === ChannelType.GuildText) {
        //     return this.executeNewThread();
        // }
        // if (this.interaction.channel!.type === ChannelType.PublicThread) {
        //     return this.executeExistingThread();
        // }
    }

    // async handleError(error: Error) {
    //     if (error instanceof GlobalQuotaError) {
    //         await this.reject(
    //             `Sorry, I'm out of tokens for the day. Ask again tomorrow!`,
    //         );
    //         return;
    //     }
    //     if (error instanceof UserQuotaError) {
    //         await this.reject(
    //             `Sorry, you're out of tokens for the day. Ask again tomorrow!`,
    //         );
    //         return;
    //     }

    //     await this.reject(
    //         `Sorry, I'm having trouble right now. Try again later!`,
    //     );
    //     return;
    // }

    // async executeCompletion(thread: Thread) {
    //     const guildService = await this.getGuildService();
    //     const transcript = await guildService.completions.complete(thread);
    //     const lastMessage = transcript.messages[transcript.messages.length - 1];
    //     return this.buildEmbeds(lastMessage);
    // }

    // async executeNewThread() {
    //     const guildService = await this.getGuildService();

    //     let thread: Thread;

    //     try {
    //         thread = await guildService.completions.check(
    //             undefined,
    //             this.interaction.member as GuildMember,
    //             this.question,
    //         );
    //     } catch (e) {
    //         await this.handleError(e as Error);
    //         return;
    //     }
    //     await this.interaction.deferReply();

    //     const starter = await this.interaction.fetchReply();

    //     thread.threadId = starter.id;

    //     const [userEmbed, botEmbed] = await this.executeCompletion(thread);

    //     await this.interaction.followUp({
    //         embeds: [userEmbed, botEmbed],
    //         components: [
    //             new ActionRowBuilder().addComponents(
    //                 new ButtonBuilder()
    //                     .setLabel("Continue in thread")
    //                     .setStyle(ButtonStyle.Primary)
    //                     .setCustomId("create-thread"),
    //             ) as any,
    //         ],
    //     });
    // }

    // async executeExistingThread() {
    //     const guildService = await this.getGuildService();

    //     if (this.interaction.channel!.type !== ChannelType.PublicThread) {
    //         return;
    //     }

    //     const textChannel = this.interaction.channel! as ThreadChannel;

    //     const threadStarter = await textChannel.fetchStarterMessage();

    //     if (!threadStarter) {
    //         return this.reject(
    //             "You can only use `/explain` in threads I started.",
    //         );
    //     }

    //     if (threadStarter.author.id !== this.client.user!.id) {
    //         return this.reject(
    //             "You can only use `/explain` in threads I started.",
    //         );
    //     }

    //     let thread: Thread;

    //     try {
    //         thread = await guildService.completions.check(
    //             threadStarter.id,
    //             this.interaction.member as GuildMember,
    //             this.question,
    //         );
    //     } catch (e) {
    //         await this.handleError(e as Error);
    //         return;
    //     }

    //     await this.interaction.deferReply();
    //     const [userEmbed, botEmbed] = await this.executeCompletion(thread);
    //     await this.interaction.editReply({
    //         embeds: [userEmbed, botEmbed],
    //     });
    // }

    // protected buildEmbeds(lastMessage: ThreadMessage) {
    //     const userEmbed = new EmbedBuilder()
    //         .setAuthor({
    //             name: this.interaction.user.username,
    //             iconURL: this.interaction.user.avatarURL()!,
    //         })
    //         .setDescription(this.question);

    //     const botEmbed = new EmbedBuilder()
    //         .setAuthor({
    //             name: this.client.user!.username,
    //             iconURL: this.client.user!.avatarURL()!,
    //         })
    //         .setDescription(lastMessage.content);

    //     return [userEmbed, botEmbed] as const;
    // }
}
