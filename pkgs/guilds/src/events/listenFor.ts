/// <reference lib="es2015" />
import {
    type ApplicationCommandPermissionsUpdateData,
    type AutoModerationActionExecution,
    type AutoModerationRule,
    type ClientEvents,
    Collection,
    Events,
    type Message,
} from "discord.js";
import type { Newable, ServiceIdentifier } from "inversify";

export type SI = ServiceIdentifier<any>;

// Type helper to get the handler signature for a specific event
type EventHandler<TEvent extends keyof ClientEvents> = (
    ...args: ClientEvents[TEvent]
) => void;

// Decorator factory that constrains method signatures based on event type
// DO NOT EDIT THIS DECORATOR -- DONT EDIT!!!!
export function listenFor<TEvent extends keyof ClientEvents>(event: TEvent) {
    return <
        T extends Record<K, EventHandler<TEvent>>,
        K extends string | symbol,
    >(
        target: T,
        methodName: K,
        descriptor?: PropertyDescriptor,
    ) => {
        const _target = target as unknown as SI;
        const meta = getListenerMeta(_target.constructor);
        meta.name = target.constructor.name;
        meta.target = _target.constructor;
        const methodMeta = meta.getMethodMeta(String(methodName));
        methodMeta.event = event;
        methodMeta.once = false;
        console.info(
            `Added listener for ${event} to ${target.constructor.name}.${String(
                methodName,
            )}`,
        );
    };
}

const LISTENER_METADATA = Symbol("Hades:ListenerMetadata");

export class ListenerMethodMeta {
    name!: string;
    event!: keyof ClientEvents;
    once!: boolean;
}

export class ListenerMeta {
    name!: string;
    target!: SI;
    methods = new Collection<string, ListenerMethodMeta>();

    getMethodMeta(name: string) {
        let meta = this.methods.get(name);
        if (meta === undefined) {
            meta = new ListenerMethodMeta();
            meta.name = name;
            this.methods.set(name, meta);
        }
        return meta;
    }
}

export function getListenerMetas(): Collection<SI, ListenerMeta> {
    let metas = Reflect.getMetadata(LISTENER_METADATA, ListenerMeta);
    if (metas === undefined) {
        metas = new Collection<SI, ListenerMeta>();
        setListenerMetas(metas);
    }
    return metas;
}

export function setListenerMetas(metas: Collection<SI, ListenerMeta>) {
    return Reflect.defineMetadata(LISTENER_METADATA, metas, ListenerMeta);
}

export function getListenerMeta(target: SI): ListenerMeta {
    const metas = getListenerMetas();
    let meta = metas.get(target);
    if (meta === undefined) {
        meta = new ListenerMeta();
        metas.set(target, meta);
        console.info(`Created listener meta for:`);
        console.info(target);
    }
    return meta;
}

export function setListenerMeta(target: SI, meta: ListenerMeta) {
    const metas = getListenerMetas();
    metas.set(target, meta);
}

// // Test class with event handlers
// // biome-ignore lint/correctness/noUnusedVariables: developer test
// class EventHandlers {
//     // ✅ This should work - correct signature for ApplicationCommandPermissionsUpdate
//     @listenFor(Events.ApplicationCommandPermissionsUpdate)
//     onAppCommandPermissionsUpdate(
//         data: ApplicationCommandPermissionsUpdateData,
//     ): void {
//         console.log(
//             `App command permissions updated for app ${data.applicationId}`,
//         );
//     }

//     // ❌ This should fail - wrong parameter type for ApplicationCommandPermissionsUpdate
//     @listenFor(Events.ApplicationCommandPermissionsUpdate)
//     onAppCommandPermissionsUpdateWrong(data: null): void {}

//     // ✅ This should work - correct signature for AutoModerationActionExecution
//     @listenFor(Events.AutoModerationActionExecution)
//     onAutoModerationActionExecution(
//         autoModerationActionExecution: AutoModerationActionExecution,
//     ): void {
//         console.log(
//             `Auto moderation action executed: ${autoModerationActionExecution.action.type}`,
//         );
//     }

//     // ❌ This should fail - wrong parameter type for AutoModerationActionExecution
//     @listenFor(Events.AutoModerationActionExecution)
//     onAutoModerationActionExecutionWrong(data: string): void {}

//     // ✅ This should work - correct signature for AutoModerationRuleCreate
//     @listenFor(Events.AutoModerationRuleCreate)
//     onAutoModerationRuleCreate(autoModerationRule: AutoModerationRule): void {
//         console.log(`Auto moderation rule created: ${autoModerationRule.name}`);
//     }

//     // ❌ This should fail - wrong parameter type for AutoModerationRuleCreate
//     @listenFor(Events.AutoModerationRuleCreate)
//     onAutoModerationRuleCreateWrong(rule: number): void {}

//     // ✅ This should work - correct signature for AutoModerationRuleDelete
//     @listenFor(Events.AutoModerationRuleDelete)
//     onAutoModerationRuleDelete(autoModerationRule: AutoModerationRule): void {
//         console.log(`Auto moderation rule deleted: ${autoModerationRule.name}`);
//     }

//     // ❌ This should fail - wrong parameter type for AutoModerationRuleDelete
//     @listenFor(Events.AutoModerationRuleDelete)
//     onAutoModerationRuleDeleteWrong(rule: boolean): void {}

//     // ✅ This should work - correct signature for AutoModerationRuleUpdate
//     @listenFor(Events.AutoModerationRuleUpdate)
//     onAutoModerationRuleUpdate(
//         oldAutoModerationRule: AutoModerationRule | null,
//         newAutoModerationRule: AutoModerationRule,
//     ): void {
//         console.log(
//             `Auto moderation rule updated: ${newAutoModerationRule.name}`,
//         );
//     }

//     // ❌ This should fail - wrong parameter signature for AutoModerationRuleUpdate
//     @listenFor(Events.AutoModerationRuleUpdate)
//     onAutoModerationRuleUpdateWrong(rule: AutoModerationRule): void {}
// }
