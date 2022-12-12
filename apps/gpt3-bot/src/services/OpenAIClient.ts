import { singleton } from "@hades-ts/hades"
import axios from "axios"
import { inject } from "inversify"


@singleton(OpenAIClient)
export class OpenAIClient {

    @inject("cfg.gpt3Token")
    token: string

    async tryCompletion(prompt: string): Promise<string> {
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
                    stop: ['User:'],
                },
                {
                    headers: this.getHeaders()
                }
            )

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