import { inject } from "inversify";
import { ApplicationCommandOptionType, GuildMember, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand, arg } from "@hades-ts/slash-commands";
import { GlobalQuotaError, UserQuotaError } from "../errors";

import { CompletionService } from "../services/CompletionService";
import { Thread, ThreadMessage } from "../types";


@command("explain", { description: "Ask the bot a question." })
export class ExplainCommand extends SlashCommand {

    @arg({ description: "Your question.", type: ApplicationCommandOptionType.String })
    question: string;

    @inject(HadesClient)
    client: HadesClient;

    @inject(CompletionService)
    threads: CompletionService;

    protected async reject(content: string) {
        await this.interaction.deferReply({
            ephemeral: true,
        })
        await this.interaction.editReply({
            content,
        })
    }

    async execute(): Promise<void> {
        if (this.interaction.channel.type === ChannelType.GuildText) {
            return this.executeNewThread();
        }

        if (this.interaction.channel.type === ChannelType.PublicThread) {
            return this.executeExistingThread();
        }
    }

    async handleError(error: Error) {
        if (error instanceof GlobalQuotaError) {
            await this.reject(`Sorry, I'm out of tokens for the day. Ask again tomorrow!`);
            return
        }
        if (error instanceof UserQuotaError) {
            await this.reject(`Sorry, you're out of tokens for the day. Ask again tomorrow!`);
            return
        }
        
        await this.reject(`Sorry, I'm having trouble right now. Try again later!`);
        return        
    }

    async executeCompletion(thread: Thread) {
        const transcript = await this.threads.complete(thread);
        const lastMessage = transcript.messages[transcript.messages.length - 1];
        return this.buildEmbeds(lastMessage);
    }

    async executeNewThread() {
        let thread: Thread;

        try {
            thread = await this.threads.check(
                undefined, 
                this.interaction.member as GuildMember, 
                this.question
            )
        } catch (e) {
            await this.handleError(e);
            return
        }
        const starter = await this.interaction.deferReply();

        thread.threadId = starter.id;        

        const [userEmbed, botEmbed] = await this.executeCompletion(thread);

        const buttonId = Math.random().toString(36).substring(7);

        const reply = await this.interaction.editReply({ 
            embeds: [
                userEmbed,
                botEmbed
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Continue in thread")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(buttonId)
                    ) as any
            ]
        });

        const collector = this.interaction.channel.createMessageComponentCollector({
            filter: (interaction) => interaction.customId === buttonId,
        })

        collector.on('collect', async (interaction) => {
            this.interaction.editReply({
                content: reply.content,
                embeds: reply.embeds,
                components: [],
            })

            collector.empty();

            await reply.startThread({
                name: this.question.substring(0, 8),
                reason: "Continuing conversation"
            })
        })       
    }

    async executeExistingThread() {

        if (this.interaction.channel.type !== ChannelType.PublicThread) {
            return 
        }

        const threadStarter = await this.interaction.channel.fetchStarterMessage();

        if (threadStarter.author.id !== this.client.user.id) {
            return this.reject('You can only use `/explain` in threads I started.')
        }

        let thread: Thread;

        try {
            thread = await this.threads.check(
                threadStarter.id, 
                this.interaction.member as GuildMember, 
                this.question
            )
        } catch (e) {
            await this.handleError(e);
            return
        }

        await this.interaction.deferReply();
        const [userEmbed, botEmbed] = await this.executeCompletion(thread);
        await this.interaction.editReply({ 
            embeds: [
                userEmbed,
                botEmbed
            ],
        });
    }

    protected buildEmbeds(lastMessage: ThreadMessage) {
        const userEmbed = new EmbedBuilder()
            .setAuthor({
                "name": this.interaction.user.username,
                "iconURL": this.interaction.user.avatarURL()
            })
            .setDescription(this.question)

        let botEmbed = new EmbedBuilder()
            .setAuthor({
                "name": this.client.user.username,
                "iconURL": this.client.user.avatarURL()
            })
            .setDescription(lastMessage.content)

        return [userEmbed, botEmbed] as const
    }
}