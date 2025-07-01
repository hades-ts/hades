import { HadesClient, singleton } from "@hades-ts/core";
import type { ClientEvents } from "discord.js";
import { inject } from "inversify";
import { guildService } from "../decorators";
import { GuildInfo } from "../GuildManager";
import { getListenerMetas, type SI } from "./listenFor";

/**
 * A callback service for Discord events.
 */
@guildService()
export class GuildEventService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(GuildInfo)
    protected guildInfo!: GuildInfo<unknown>;

    /**
     * Register a bot for event callbacks.
     * @param bot The bot to register callbacks for.
     */
    register(bot: object) {
        console.log(
            `registering guild listener ${bot.constructor.name} in guild ${this.guildInfo.id}`,
        );
        const metas = getListenerMetas();

        let ctor = Object.getPrototypeOf(bot).constructor;

        while (ctor !== Object.prototype) {
            console.log(`ctor: ${ctor.name}`);
            const meta = metas.get(ctor as SI);

            if (meta === undefined) {
                console.log(`meta is undefined`);
                return;
            }

            console.log(`meta: ${meta}`);

            for (const methodMeta of meta.methods.values()) {
                console.log(`methodMeta: ${methodMeta}`);
                const method = bot[methodMeta.name as keyof typeof bot] as (
                    ...args: any[]
                ) => void;

                if (method === undefined) {
                    console.log(`method is undefined`);
                    throw new Error(
                        `Method ${methodMeta.name} not found on ${bot.constructor.name}`,
                    );
                }

                const event = methodMeta.event as keyof ClientEvents;

                console.log(
                    `registering event ${event} in guild ${this.guildInfo.id} against method ${methodMeta.name}`,
                );

                if (event === "applicationCommandPermissionsUpdate") {
                    this.client.on(event, (data) => {
                        if (data.guildId !== this.guildInfo.id) return;
                        method.call(bot, data);
                    });
                    continue;
                }

                if (event === "autoModerationActionExecution") {
                    this.client.on(event, (autoModerationActionExecution) => {
                        if (
                            autoModerationActionExecution.guild.id !==
                            this.guildInfo.id
                        )
                            return;
                        method.call(bot, autoModerationActionExecution);
                    });
                    continue;
                }

                if (event === "autoModerationRuleCreate") {
                    this.client.on(event, (autoModerationRule) => {
                        if (autoModerationRule.guild.id !== this.guildInfo.id)
                            return;
                        method.call(bot, autoModerationRule);
                    });
                    continue;
                }

                if (event === "autoModerationRuleDelete") {
                    this.client.on(event, (autoModerationRule) => {
                        if (autoModerationRule.guild.id !== this.guildInfo.id)
                            return;
                        method.call(bot, autoModerationRule);
                    });
                    continue;
                }

                if (event === "autoModerationRuleUpdate") {
                    this.client.on(
                        event,
                        (oldAutoModerationRule, newAutoModerationRule) => {
                            if (
                                newAutoModerationRule.guild.id !==
                                this.guildInfo.id
                            )
                                return;
                            method.call(
                                bot,
                                oldAutoModerationRule,
                                newAutoModerationRule,
                            );
                        },
                    );
                    continue;
                }

                if (event === "channelCreate") {
                    this.client.on(event, (channel) => {
                        if (channel.guild.id !== this.guildInfo.id) return;
                        method.call(bot, channel);
                    });
                    continue;
                }

                if (event === "channelDelete") {
                    continue;
                }

                if (event === "channelPinsUpdate") {
                    continue;
                }

                if (event === "channelUpdate") {
                    this.client.on(event, (oldChannel, newChannel) => {
                        if (
                            !newChannel.isDMBased() &&
                            newChannel.guild.id !== this.guildInfo.id
                        )
                            return;
                        method.call(bot, oldChannel, newChannel);
                    });
                    continue;
                }

                if (event === "debug") {
                    continue;
                }

                if (event === "emojiCreate") {
                    this.client.on(event, (emoji) => {
                        if (emoji.guild.id !== this.guildInfo.id) return;
                        method.call(bot, emoji);
                    });
                    continue;
                }

                if (event === "emojiDelete") {
                    this.client.on(event, (emoji) => {
                        if (emoji.guild.id !== this.guildInfo.id) return;
                        method.call(bot, emoji);
                    });
                    continue;
                }

                if (event === "emojiUpdate") {
                    this.client.on(event, (oldEmoji, newEmoji) => {
                        if (newEmoji.guild.id !== this.guildInfo.id) return;
                        method.call(bot, oldEmoji, newEmoji);
                    });
                    continue;
                }

                if (event === "entitlementCreate") {
                    this.client.on(event, (entitlement) => {
                        if (entitlement.guildId !== this.guildInfo.id) return;
                        method.call(bot, entitlement);
                    });
                    continue;
                }

                if (event === "entitlementDelete") {
                    this.client.on(event, (entitlement) => {
                        if (entitlement.guildId !== this.guildInfo.id) return;
                        method.call(bot, entitlement);
                    });
                }

                if (event === "entitlementUpdate") {
                    this.client.on(event, (oldEntitlement, newEntitlement) => {
                        if (newEntitlement.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, oldEntitlement, newEntitlement);
                    });
                    continue;
                }

                if (event === "error") {
                    continue;
                }

                if (event === "guildAuditLogEntryCreate") {
                    this.client.on(event, (auditLogEntry, guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, auditLogEntry);
                    });
                    continue;
                }

                if (event === "guildAvailable") {
                    this.client.on(event, (guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, guild);
                    });
                    continue;
                }

                if (event === "guildBanAdd") {
                    this.client.on(event, (ban) => {
                        if (ban.guild.id !== this.guildInfo.id) return;
                        method.call(bot, ban);
                    });
                    continue;
                }

                if (event === "guildBanRemove") {
                    this.client.on(event, (ban) => {
                        if (ban.guild.id !== this.guildInfo.id) return;
                        method.call(bot, ban);
                    });
                }

                if (event === "guildCreate") {
                    this.client.on(event, (guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, guild);
                    });
                    continue;
                }

                if (event === "guildDelete") {
                    this.client.on(event, (guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, guild);
                    });
                    continue;
                }

                if (event === "guildIntegrationsUpdate") {
                    this.client.on(event, (guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, guild);
                    });
                    continue;
                }

                if (event === "guildMemberAdd") {
                    this.client.on(event, (member) => {
                        if (member.guild.id !== this.guildInfo.id) return;
                        method.call(bot, member);
                    });
                    continue;
                }

                if (event === "guildMemberAvailable") {
                    this.client.on(event, (member) => {
                        if (member.guild.id !== this.guildInfo.id) return;
                        method.call(bot, member);
                    });
                    continue;
                }

                if (event === "guildMemberRemove") {
                    this.client.on(event, (member) => {
                        if (member.guild.id !== this.guildInfo.id) return;
                        method.call(bot, member);
                    });
                }

                if (event === "guildMembersChunk") {
                    this.client.on(event, (members, guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, members, guild);
                    });
                    continue;
                }

                if (event === "guildMemberUpdate") {
                    this.client.on(event, (oldMember, newMember) => {
                        if (newMember.guild.id !== this.guildInfo.id) return;
                        method.call(bot, oldMember, newMember);
                    });
                    continue;
                }

                if (event === "guildScheduledEventCreate") {
                    this.client.on(event, (guildScheduledEvent) => {
                        if (guildScheduledEvent.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, guildScheduledEvent);
                    });
                    continue;
                }

                if (event === "guildScheduledEventDelete") {
                    this.client.on(event, (guildScheduledEvent) => {
                        if (guildScheduledEvent.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, guildScheduledEvent);
                    });
                    continue;
                }

                if (event === "guildScheduledEventUpdate") {
                    this.client.on(
                        event,
                        (oldGuildScheduledEvent, newGuildScheduledEvent) => {
                            if (
                                newGuildScheduledEvent.guildId !==
                                this.guildInfo.id
                            )
                                return;
                            method.call(
                                bot,
                                oldGuildScheduledEvent,
                                newGuildScheduledEvent,
                            );
                        },
                    );
                    continue;
                }

                if (event === "guildScheduledEventUserAdd") {
                    this.client.on(event, (guildScheduledEvent, user) => {
                        if (guildScheduledEvent.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, guildScheduledEvent, user);
                    });
                    continue;
                }

                if (event === "guildScheduledEventUserRemove") {
                    this.client.on(event, (guildScheduledEvent, user) => {
                        if (guildScheduledEvent.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, guildScheduledEvent, user);
                    });
                    continue;
                }

                if (event === "guildSoundboardSoundCreate") {
                    this.client.on(event, (soundboardSound) => {
                        if (soundboardSound.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, soundboardSound);
                    });
                    continue;
                }

                if (event === "guildSoundboardSoundDelete") {
                    this.client.on(event, (soundboardSound) => {
                        if (soundboardSound.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, soundboardSound);
                    });
                }

                if (event === "guildSoundboardSoundUpdate") {
                    this.client.on(
                        event,
                        (oldGuildSoundboardSound, newGuildSoundboardSound) => {
                            if (
                                newGuildSoundboardSound.guildId !==
                                this.guildInfo.id
                            )
                                return;
                            method.call(
                                bot,
                                oldGuildSoundboardSound,
                                newGuildSoundboardSound,
                            );
                        },
                    );
                    continue;
                }

                // doesn't work for some reason, skip
                // if (event === "guildSoundboardSoundsUpdate") {
                //     this.client.on(event, (soundboardSounds, guild) => {
                //         if (guild.id !== this.guildInfo.id) return;
                //         method.bind(bot)(soundboardSounds, guild);
                //     });
                //     return;
                // }

                if (event === "guildUnavailable") {
                    this.client.on(event, (guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, guild);
                    });
                    continue;
                }

                if (event === "guildUpdate") {
                    this.client.on(event, (oldGuild, newGuild) => {
                        if (newGuild.id !== this.guildInfo.id) return;
                        method.call(bot, oldGuild, newGuild);
                    });
                }

                if (event === "interactionCreate") {
                    this.client.on(event, (interaction) => {
                        if (interaction.guildId !== this.guildInfo.id) return;
                        method.call(bot, interaction);
                    });
                    continue;
                }

                if (event === "inviteCreate") {
                    this.client.on(event, (invite) => {
                        if (invite.guild?.id !== this.guildInfo.id) return;
                        method.call(bot, invite);
                    });
                    continue;
                }

                if (event === "inviteDelete") {
                    this.client.on(event, (invite) => {
                        if (invite.guild?.id !== this.guildInfo.id) return;
                        method.call(bot, invite);
                    });
                    continue;
                }

                if (event === "messageCreate") {
                    this.client.on(event, (message) => {
                        if (message.guildId !== this.guildInfo.id) return;
                        method.call(bot, message);
                    });
                    continue;
                }

                if (event === "messageDelete") {
                    this.client.on(event, (message) => {
                        if (message.guildId !== this.guildInfo.id) return;
                        method.call(bot, message);
                    });
                    continue;
                }

                if (event === "messageDeleteBulk") {
                    this.client.on(event, (messages, channel) => {
                        if (channel.guildId !== this.guildInfo.id) return;
                        method.call(bot, messages, channel);
                    });
                    continue;
                }

                if (event === "messageReactionAdd") {
                    this.client.on(event, (reaction, user) => {
                        if (reaction.message.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, reaction, user);
                    });
                    continue;
                }

                if (event === "messageReactionRemove") {
                    this.client.on(event, (reaction, user) => {
                        if (reaction.message.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, reaction, user);
                    });
                }

                if (event === "messageReactionRemoveAll") {
                    this.client.on(event, (message) => {
                        if (message.guildId !== this.guildInfo.id) return;
                        method.call(bot, message);
                    });
                }

                if (event === "messageReactionRemoveEmoji") {
                    this.client.on(event, (reaction) => {
                        if (reaction.message.guildId !== this.guildInfo.id)
                            return;
                        method.call(bot, reaction);
                    });
                    continue;
                }

                if (event === "messageUpdate") {
                    this.client.on(event, (oldMessage, newMessage) => {
                        if (newMessage.guildId !== this.guildInfo.id) return;
                        method.call(bot, oldMessage, newMessage);
                    });
                    continue;
                }

                if (event === "presenceUpdate") {
                    this.client.on(event, (oldPresence, newPresence) => {
                        if (newPresence.guild?.id !== this.guildInfo.id) return;
                        method.call(bot, oldPresence, newPresence);
                    });
                    continue;
                }

                if (event === "ready") {
                    continue;
                }

                if (event === "roleCreate") {
                    this.client.on(event, (role) => {
                        if (role.guild.id !== this.guildInfo.id) return;
                        method.call(bot, role);
                    });
                    continue;
                }

                if (event === "roleDelete") {
                    this.client.on(event, (role) => {
                        if (role.guild.id !== this.guildInfo.id) return;
                        method.call(bot, role);
                    });
                    continue;
                }

                if (event === "roleUpdate") {
                    this.client.on(event, (oldRole, newRole) => {
                        if (newRole.guild.id !== this.guildInfo.id) return;
                        method.call(bot, oldRole, newRole);
                    });
                    continue;
                }

                if (event === "shardDisconnect") {
                    continue;
                }

                if (event === "shardError") {
                    continue;
                }

                if (event === "shardReady") {
                    continue;
                }

                if (event === "shardReconnecting") {
                    continue;
                }

                if (event === "shardResume") {
                    continue;
                }

                if (event === "soundboardSounds") {
                    this.client.on(event, (soundboardSounds, guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, soundboardSounds, guild);
                    });
                    continue;
                }

                if (event === "stageInstanceCreate") {
                    this.client.on(event, (stageInstance) => {
                        if (stageInstance.guildId !== this.guildInfo.id) return;
                        method.call(bot, stageInstance);
                    });
                    continue;
                }

                if (event === "stageInstanceDelete") {
                    this.client.on(event, (stageInstance) => {
                        if (stageInstance.guildId !== this.guildInfo.id) return;
                        method.call(bot, stageInstance);
                    });
                }

                if (event === "stageInstanceUpdate") {
                    this.client.on(
                        event,
                        (oldStageInstance, newStageInstance) => {
                            if (newStageInstance.guildId !== this.guildInfo.id)
                                return;
                            method.call(
                                bot,
                                oldStageInstance,
                                newStageInstance,
                            );
                        },
                    );
                    continue;
                }

                if (event === "stickerCreate") {
                    this.client.on(event, (sticker) => {
                        if (sticker.guildId !== this.guildInfo.id) return;
                        method.call(bot, sticker);
                    });
                    continue;
                }

                if (event === "stickerDelete") {
                    this.client.on(event, (sticker) => {
                        if (sticker.guildId !== this.guildInfo.id) return;
                        method.call(bot, sticker);
                    });
                    continue;
                }

                if (event === "stickerUpdate") {
                    this.client.on(event, (oldSticker, newSticker) => {
                        if (newSticker.guildId !== this.guildInfo.id) return;
                        method.call(bot, oldSticker, newSticker);
                    });
                    continue;
                }

                if (event === "subscriptionCreate") {
                    continue;
                }

                if (event === "subscriptionDelete") {
                    continue;
                }

                if (event === "subscriptionUpdate") {
                    continue;
                }

                if (event === "threadCreate") {
                    this.client.on(event, (thread) => {
                        if (thread.guildId !== this.guildInfo.id) return;
                        method.call(bot, thread);
                    });
                    continue;
                }

                if (event === "threadDelete") {
                    this.client.on(event, (thread) => {
                        if (thread.guildId !== this.guildInfo.id) return;
                        method.call(bot, thread);
                    });
                    continue;
                }

                if (event === "threadListSync") {
                    this.client.on(event, (threads, guild) => {
                        if (guild.id !== this.guildInfo.id) return;
                        method.call(bot, threads, guild);
                    });
                    continue;
                }

                if (event === "threadMembersUpdate") {
                    this.client.on(
                        event,
                        (addedMembers, removedMembers, thread) => {
                            if (thread.guildId !== this.guildInfo.id) return;
                            method.call(
                                bot,
                                addedMembers,
                                removedMembers,
                                thread,
                            );
                        },
                    );
                    continue;
                }

                if (event === "threadMemberUpdate") {
                    continue;
                }

                if (event === "threadUpdate") {
                    this.client.on(event, (oldThread, newThread) => {
                        if (newThread.guildId !== this.guildInfo.id) return;
                        method.call(bot, oldThread, newThread);
                    });
                    continue;
                }

                if (event === "typingStart") {
                    this.client.on(event, (typing) => {
                        if (typing.guild?.id !== this.guildInfo.id) return;
                        method.call(bot, typing);
                    });
                    continue;
                }

                if (event === "userUpdate") {
                    this.client.on(event, (oldUser, newUser) => {
                        if (newUser.id !== this.guildInfo.id) return;
                        method.call(bot, oldUser, newUser);
                    });
                    continue;
                }

                if (event === "voiceChannelEffectSend") {
                    this.client.on(event, (voiceChannelEffect) => {
                        if (voiceChannelEffect.guild?.id !== this.guildInfo.id)
                            return;
                        method.call(bot, voiceChannelEffect);
                    });
                    continue;
                }

                if (event === "voiceStateUpdate") {
                    this.client.on(event, (oldVoiceState, newVoiceState) => {
                        if (newVoiceState.guild?.id !== this.guildInfo.id)
                            return;
                        method.call(bot, oldVoiceState, newVoiceState);
                    });
                    continue;
                }

                if (event === "warn") {
                    continue;
                }

                if (event === "webhooksUpdate") {
                    this.client.on(event, (channel) => {
                        if (channel.guild?.id !== this.guildInfo.id) return;
                        method.call(bot, channel);
                    });
                }
            }

            ctor = Object.getPrototypeOf(ctor);
        }
    }
}
