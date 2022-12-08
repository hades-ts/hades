# Client Events

`HadesBotService` has a number of methods you can override to handle the
various [Discord.js client events](https://discord.js.org/#/docs/main/main/class/Client):

## logging

- async **onDebug**(...args: any[]) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-debug)
- async **onError**(...args: any[]) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-error)
- async **onWarn**(...args: any[]) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-warn)

## channels

- async **onChannelCreate**(channel: Channel) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-channelCreate)
- async **onChannelDelete**(channel: Channel) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-channelDelete)
- async **onChannelPinsUpdate**(channel: Channel, time: Date) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-channelPinsUpdate)
- async **onChannelUpdate**(oldChannel: Channel, newChannel: Channel) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-channelUpdate)

## connection

- async **onReady**() [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-ready)
- async **onReconnecting**() [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-reconnecting)
- async **onDisconnect**(event: CloseEvent) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-disconnect)

## emoji

- async **onEmojiCreate**(emoji: Emoji) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-emojiCreate)
- async **onEmojiDelete**(emoji: Emoji) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-emojiDelete)
- async **onEmojiUpdate**(emoji: Emoji) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-emojiUpdate)

## bans

- async **onGuildBanAdd**(guild: Guild, user: User) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildBanAdd)
- async **onGuildBanRemove**(guild: Guild, user: User) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildBanRemove)

## bot guilds

- async **onGuildCreate**(guild: Guild) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildCreate)
- async **onGuildDelete**(guild: Guild) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildDelete)
- async **onGuildUnavailable**(guild: Guild) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildUnavailable)

## guild members

- async **onGuildMemberAdd**(member: GuildMember) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildMemberAdd)
- async **onGuildMemberAvailable**(member: GuildMember) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildMemberAvailable)
- async **onGuildMemberRemove**(member: GuildMember) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildMemberRemove)
- async **onGuildMemberSpeaking**(member: GuildMember, isSpeaking: boolean) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildMemberSpeaking)
- async **onGuildMemberUpdate**(oldMember: GuildMember, newMember: GuildMember) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildMemberUpdate)
- async **onGuildMembersChunk**(members: GuildMember[], guild: Guild) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildMembersChunk)
- async **onGuildUpdate**(oldGuild: Guild, newGuild: Guild) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-guildUpdate)

## messages

- async **onMessage**(message: Message) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-message)
- async **onMessageDelete**(message: Message) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-messageDelete)
- async **onMessageDeleteBulk**(messages: Collection<Snowflake, Message>) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-messageDeleteBulk)
- async **onMessageReactionAdd**(reaction: MessageReaction, user: User) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-messageReactionAdd)
- async **onMessageReactionRemove**(reaction: MessageReaction, user: User) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-messageReactionRemove)
- async **onMessageReactionRemoveAll**(message: Message) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-messageReactionRemoveAll)
- async **onMessageUpdate**(oldMessage: Message, newMessage: Message) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-messageUpdate)

## prescence

- async **onPresenceUpdate**(oldMember: GuildMember, newMember: GuildMember) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-presenceUpdate)
- async **onTypingStart**(channel: Channel, user: User) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-typingStart)
- async **onTypingStop**(channel: Channel, user: User) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-typingStop)

## roles

- async **onRoleCreate**(role: Role) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-roleCreate)
- async **onRoleDelete**(role: Role) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-roleDelete)
- async **onRoleUpdate**(oldRole: Role, newRole: Role) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-roleUpdate)

## users

- async **onUserNoteUpdate**(user: User, oldNote: string, newNote: string) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-userNoteUpdate)
- async **onUserUpdate**(oldUser: User, newUser: User) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-userUpdate)
- async **onVoiceStateUpdate**(oldMember: GuildMember, newMember: GuildMember) [?](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=e-voiceStateUpdate)
