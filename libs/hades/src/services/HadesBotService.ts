/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Channel,
    Collection,
    Emoji,
    Guild,
    GuildMember,
    Interaction,
    Message,
    MessageReaction,
    Role,
    Snowflake,
    User,
} from "discord.js";
import { inject, postConstruct } from "inversify";

import { EventService } from "./EventService";
import { HadesClient } from "./HadesClient";

/**
 * A base service for building bots with Hades.
 *
 * Comes with a HadesClient and EventService. The bot will automatically
 * register with the EventService.
 */
export class HadesBotService {
    /**
     * The Discord client.
     */
    @inject(HadesClient)
    protected client: HadesClient;

    /**
     * The Discord bot token.
     */
    @inject("cfg.discordToken")
    protected token: String;

    /**
     * Used to receive Discord events.
     */
    @inject(EventService)
    protected eventService: EventService;

    @postConstruct()
    postConstruct() {
        this.eventService.register(this);
    }

    /**
     * Connect to Discord.
     * @returns Promise<string>
     */
    async login() {
        return this.client.login(this.token.toString());
    }

    get highlight() {
        return `<@${this.client.user.id}>`;
    }

    protected isHighlight(content: string) {
        return content.startsWith(this.highlight);
    }

    /* logging */
    async onDebug(...args: any[]) {
        console.debug(...args);
    }
    async onError(...args: any[]) {
        console.error(...args);
    }
    async onWarn(...args: any[]) {
        console.warn(...args);
    }

    /* channels */
    async onChannelCreate(channel: Channel) {}
    async onChannelDelete(channel: Channel) {}
    async onChannelPinsUpdate(channel: Channel, time: Date) {}
    async onChannelUpdate(oldChannel: Channel, newChannel: Channel) {}

    /* connection */
    async onReady() {}
    async onReconnecting() {}
    async onDisconnect(event: CloseEvent) {}

    /* emoji */
    async onEmojiCreate(emoji: Emoji) {}
    async onEmojiDelete(emoji: Emoji) {}
    async onEmojiUpdate(emoji: Emoji) {}

    /* bans */
    async onGuildBanAdd(guild: Guild, user: User) {}
    async onGuildBanRemove(guild: Guild, user: User) {}

    /* bot guilds */
    async onGuildCreate(guild: Guild) {}
    async onGuildDelete(guild: Guild) {}
    async onGuildUnavailable(guild: Guild) {}

    /* guild members */
    async onGuildMemberAdd(member: GuildMember) {}
    async onGuildMemberAvailable(member: GuildMember) {}
    async onGuildMemberRemove(member: GuildMember) {}
    async onGuildMemberSpeaking(member: GuildMember, isSpeaking: boolean) {}
    async onGuildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {}
    async onGuildMembersChunk(members: GuildMember[], guild: Guild) {}
    async onGuildUpdate(oldGuild: Guild, newGuild: Guild) {}

    /* interactions */
    async onInteractionCreate<T extends Interaction>(interaction: T) {}

    /* messages */
    async onMessage<T extends Message>(message: T) {}
    async onMessageDelete(message: Message) {}
    async onMessageDeleteBulk(messages: Collection<Snowflake, Message>) {}
    async onMessageReactionAdd(reaction: MessageReaction, user: User) {}
    async onMessageReactionRemove(reaction: MessageReaction, user: User) {}
    async onMessageReactionRemoveAll(message: Message) {}
    async onMessageUpdate(oldMessage: Message, newMessage: Message) {}

    /* prescence */
    async onPresenceUpdate(oldMember: GuildMember, newMember: GuildMember) {}
    async onTypingStart(channel: Channel, user: User) {}
    async onTypingStop(channel: Channel, user: User) {}

    /* roles */
    async onRoleCreate(role: Role) {}
    async onRoleDelete(role: Role) {}
    async onRoleUpdate(oldRole: Role, newRole: Role) {}

    /* users */
    async onUserNoteUpdate(user: User, oldNote: string, newNote: string) {}
    async onUserUpdate(oldUser: User, newUser: User) {}
    async onVoiceStateUpdate(oldMember: GuildMember, newMember: GuildMember) {}
}
