# DiscordService

**Bound to**: `DiscordService` as *Singleton*

Convenience service for interacting with the Discord API.

## Properties

- **guilds**: `Collection<string, Guild>`

## Methods

- **getName**(*guildId*: string): `string | undefined`
- **getMembers**(*guildId*: string): `Collection<string, GuildMember> | undefined`
- **getMember**(*guildId*: string, memberId: string): `GuildMember | undefined`
- **getOwner**(*guildId*: string): `string | undefined`
- **getChansOf**(*type*: ChannelTypes, *guildId*: string): `Collection<string, GuildChannel>`
- **getCategories**(*guildId*: string): `Collection<string, CategoryChannel>`
- **getChannels**(*guildId*: string): `Collection<string, TextChannel>`
- **getChannel**(*guildId*: string, channelId: string): `GuildChannel | undefined`
- **getRoles**(*guildId*: string): `Collection<string, Role>`
