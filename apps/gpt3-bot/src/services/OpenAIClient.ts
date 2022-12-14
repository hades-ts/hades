import axios from "axios"
import { inject } from "inversify"

import { singleton } from "@hades-ts/hades"

import { QuotaService } from "./QuotaService"


@singleton(OpenAIClient)
export class OpenAIClient {

    @inject("cfg.gpt3Token")
    token: string

    @inject(QuotaService)
    quota: QuotaService

    async complete(userId: string, prompt: string, stop?: string[]) {
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/completions",
                {
                    model: 'text-davinci-003',
                    prompt,
                    max_tokens: 240,
                    stream: false,
                    echo: true,
                    temperature: 0.8,
                    stop: stop || ['Q:'],
                },
                {
                    headers: this.getHeaders()
                }
            )

            const total_tokens = response.data.usage.total_tokens;
            this.quota.addTokens(userId, total_tokens)
            return response.data.choices[0].text.replace(prompt, "").trim()
        } catch (error) {
            console.error(`Failed to get open ai completion response: ${error}`)
            throw error
        }
    }
      
    protected getHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
        }
    }
}