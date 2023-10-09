import { command, SlashCommand } from "@hades-ts/slash-commands";
import { GuildMember, InteractionReplyOptions, TextChannel } from "discord.js";
import { inject } from "inversify";

import { GuildConfig } from "../config";
import { GuildServiceFactory } from "../services";

@command("create", { description: "Create a new multiplayer message." })
export class CreateChaosCommand extends SlashCommand {
    @inject("cfg.botOwner")
    protected botOwner!: string;

    @inject("cfg.guilds")
    protected configGuilds!: Record<string, GuildConfig>;

    @inject(GuildServiceFactory)
    protected guildServiceFactory!: GuildServiceFactory;

    protected get config() {
        return this.configGuilds[this.interaction.guildId!];
    }

    protected get member() {
        return this.interaction.member! as GuildMember;
    }

    protected get channel() {
        return this.interaction.channel! as TextChannel;
    }

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            });
            await this.interaction.editReply({
                content,
            });
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    async execute(): Promise<void> {
        if (this.interaction.user.id !== this.botOwner) {
            await this.reject("Sorry, you don't have permission to do that.");
            return;
        }

        const guildId = this.interaction.guildId!;
        const guildConfig = this.configGuilds[guildId];

        if (!guildConfig) {
            await this.reject("Sorry, I'm not set up for this guild yet. Try again later!");
            return;
        }

        if (guildConfig.disabled) {
            await this.reject("Sorry, I'm disabled in this server at the moment.");
            return;
        }

        const guild = await this.guildServiceFactory.getGuildService(this.interaction.guild!);

        try {
            await guild.threading.validateCreation(this.member.id, this.channel.id);
        } catch (error) {
            if (error instanceof Error) {
                return this.reject(error.message);
            }
            return this.reject("Something went wrong. Please try again later.");
        }

        await this.interaction.deferReply();
        const message = await this.interaction.fetchReply();
        const content = (await guild.threading.createThread(this.member, message)) as InteractionReplyOptions;
        await this.interaction.followUp(content);
        await message.startThread({
            name: "Chaos Thread",
        });
    }
}
