import { singleton } from "@hades-ts/hades";
import axios, { type AxiosResponse } from "axios";
import { inject } from "inversify";

import { QuotaService } from "./QuotaService";

@singleton(OpenAIClient)
export class OpenAIClient {
    @inject("cfg.gpt3Token")
    protected token!: string;

    @inject(QuotaService)
    protected quota!: QuotaService;

    protected getHeaders() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
        };
    }

    protected postRequest(prompt: string, stop?: string[]) {
        return axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003",
                prompt,
                max_tokens: 240,
                stream: false,
                echo: true,
                temperature: 0.8,
                stop: stop || ["Q:"],
            },
            {
                headers: this.getHeaders(),
            },
        );
    }

    protected getCompletion(prompt: string, response: AxiosResponse) {
        const completion = response.data.choices[0].text
            .replace(prompt, "")
            .trim();
        const tokens = response.data.usage.total_tokens;
        return { completion, tokens };
    }

    async complete(prompt: string, stop?: string[]) {
        try {
            const response = await this.postRequest(prompt, stop);
            return this.getCompletion(prompt, response);
        } catch (error) {
            console.error(
                `Failed to get open ai completion response: ${error}`,
            );
            throw error;
        }
    }
}
