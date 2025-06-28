import z from "zod";
import { createResource } from "../../db/actions/resources";

export const addResourceTool = {
    name: "addResource",
    description: "Add a resource to your knowledge-base.",
    parameters: z.object({
        content: z.string().describe("The content of the resource"),
    }),
    execute: async ({ content }: any) => createResource({ content }),
};
