import { singleton } from "@hades-ts/hades";
import fs from "fs";
import GPT3Tokenizer from "gpt3-tokenizer";
import { inject } from "inversify";

import { AiGlobalQuotaError, AiUserQuotaError } from "../errors";
import { QuotaConfig } from "../schema";
import { aiTokens } from "../tokens";

export type Quota = {
    currentDay: string;
    total: number;
    users: Record<string, number>;
};

@singleton(TokenQuota)
export class TokenQuota {
    @inject(aiTokens.TokenQuota)
    protected quotaConfig!: QuotaConfig;

    protected getToday() {
        const today = new Date();
        return today.toISOString().split("T")[0];
    }

    protected isToday(date: string) {
        return date === this.getToday();
    }

    protected loadQuota(): Quota {
        if (!fs.existsSync(this.quotaConfig.quotaFile)) {
            return {
                currentDay: this.getToday(),
                total: 0,
                users: {},
            };
        }

        const text = fs.readFileSync(this.quotaConfig.quotaFile, "utf-8");
        const quota = JSON.parse(text);
        this.checkQuota(quota);
        return quota;
    }

    protected saveQuota(quota: Quota) {
        fs.writeFileSync(this.quotaConfig.quotaFile, JSON.stringify(quota, null, 2));
    }

    protected resetQuota(quota: Quota) {
        quota.currentDay = this.getToday();
        quota.total = 0;
        quota.users = {};
        this.saveQuota(quota);
    }

    protected checkQuota(quota: Quota) {
        if (!this.isToday(quota.currentDay)) {
            this.resetQuota(quota);
        }
    }

    protected getTokens(userId: string) {
        const quota = this.loadQuota();
        this.checkQuota(quota);
        return quota.users[userId] || 0;
    }

    spendTokens(userId: string, tokens: number) {
        const quota = this.loadQuota();
        const userQuota = quota.users[userId] || 0;
        quota.total += tokens;
        quota.users[userId] = userQuota + tokens;
        this.saveQuota(quota);
    }

    checkTokens(userId: string, text: string) {
        const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
        const tokens = tokenizer.encode(text).bpe.length;
        const quota = this.loadQuota();

        if (quota.total + tokens > this.quotaConfig.globalDailyTokenLimit) {
            throw new AiGlobalQuotaError(`Global quota exceeded`);
        }

        const userQuota = quota.users[userId] || 0;

        if (userQuota + tokens > this.quotaConfig.userDailyTokenLimit) {
            throw new AiUserQuotaError(`User quota exceeded`);
        }
    }
}
