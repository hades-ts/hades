import { createClassCategoric } from "@ldlework/categoric-decorators";
import type z from "zod/v4";

export type ToolConfig = {
    name: string;
    description: string;
    parameters: z.ZodObject<any>;
};

export const [_tool, findTools] = createClassCategoric<ToolConfig>();

export const tool = (config: ToolConfig) => {
    return (target: any) => {
        _tool(config)(target);
        target.toolConfig = config;
    };
};
