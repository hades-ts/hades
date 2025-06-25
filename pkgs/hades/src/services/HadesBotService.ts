/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type Channel,
    Collection,
    type Emoji,
    type Guild,
    type GuildBan,
    type GuildMember,
    type GuildMembersChunk,
    type GuildTextBasedChannel,
    type Interaction,
    type Message,
    type MessageReaction,
    type MessageReactionEventDetails,
    type OmitPartialGroupDMChannel,
    type PartialGuildMember,
    type PartialMessage,
    type PartialMessageReaction,
    type PartialUser,
    type Presence,
    type ReadonlyCollection,
    type Role,
    type Snowflake,
    type Typing,
    type User,
    type VoiceState,
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
    protected client!: HadesClient;

    /**
     * The Discord bot token.
     */
    @inject("cfg.discordToken")
    protected token!: string;

    /**
     * Used to receive Discord events.
     */
    @inject(EventService)
    protected eventService!: EventService;

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
        return `<@${this.client.user?.id}>`;
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
    async onGuildBanAdd(ban: GuildBan) {}
    async onGuildBanRemove(ban: GuildBan) {}

    /* bot guilds */
    async onGuildCreate(guild: Guild) {}
    async onGuildDelete(guild: Guild) {}
    async onGuildUnavailable(guild: Guild) {}

    /* guild members */
    async onGuildMemberAdd(member: GuildMember) {}
    async onGuildMemberAvailable(member: GuildMember | PartialGuildMember) {}
    async onGuildMemberRemove(member: GuildMember | PartialGuildMember) {}
    async onGuildMemberSpeaking(member: GuildMember, isSpeaking: boolean) {}
    async onGuildMemberUpdate(
        oldMember: GuildMember | PartialGuildMember,
        newMember: GuildMember | PartialGuildMember,
    ) {}
    async onGuildMembersChunk(
        members: ReadonlyCollection<Snowflake, GuildMember>,
        guild: Guild,
        data: GuildMembersChunk,
    ) {}
    async onGuildUpdate(oldGuild: Guild, newGuild: Guild) {}

    /* interactions */
    async onInteractionCreate<T extends Interaction>(interaction: T) {}

    /* messages */
    async onMessage<T extends Message>(message: T) {}
    async onMessageDelete(
        message: OmitPartialGroupDMChannel<Message | PartialMessage>,
    ) {}
    async onMessageDeleteBulk(
        messages: ReadonlyCollection<
            Snowflake,
            OmitPartialGroupDMChannel<Message | PartialMessage>
        >,
        channel: GuildTextBasedChannel,
    ) {}
    async onMessageReactionAdd(
        reaction: MessageReaction | PartialMessageReaction,
        user: User | PartialUser,
        details: MessageReactionEventDetails,
    ) {}
    async onMessageReactionRemove(
        reaction: MessageReaction | PartialMessageReaction,
        user: User | PartialUser,
        details: MessageReactionEventDetails,
    ) {}
    async onMessageReactionRemoveAll(
        message: OmitPartialGroupDMChannel<Message | PartialMessage>,
        reactions: ReadonlyCollection<string | Snowflake, MessageReaction>,
    ) {}
    async onMessageUpdate(
        oldMessage: OmitPartialGroupDMChannel<Message | PartialMessage>,
        newMessage: OmitPartialGroupDMChannel<Message>,
    ) {}

    /* prescence */
    async onPresenceUpdate(
        oldPresence: Presence | null,
        newPresence: Presence,
    ) {}
    async onTypingStart(typing: Typing) {}
    async onTypingStop(channel: Channel, user: User) {}

    /* roles */
    async onRoleCreate(role: Role) {}
    async onRoleDelete(role: Role) {}
    async onRoleUpdate(oldRole: Role, newRole: Role) {}

    /* users */
    async onUserNoteUpdate(user: User, oldNote: string, newNote: string) {}
    async onUserUpdate(oldUser: User | PartialUser, newUser: User) {}
    async onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {}
}
