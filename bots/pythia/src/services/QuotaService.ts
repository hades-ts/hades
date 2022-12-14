import fs from "fs"

import { inject } from "inversify";
import GPT3Tokenizer from 'gpt3-tokenizer';

import { singleton } from "@hades-ts/hades";

import { GlobalQuotaError, UserQuotaError } from "../errors";
import { ConfigQuota } from "../config";
import { QuotaBypassService } from "./QuotaBypassService";


export type Quota = {
    currentDay: string,
    total: number,
    users: Record<string, number>
}

@singleton(QuotaService)
export class QuotaService {

    @inject('cfg.quota')
    quotaConfig: ConfigQuota

    @inject('cfg.botOwner')
    botOwner: string

    @inject(QuotaBypassService)
    bypassService: QuotaBypassService

    protected getToday() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    protected isToday(date: string) {
        return date === this.getToday();
    }

    protected loadQuota(): Quota {
        if (!fs.existsSync(this.quotaConfig.quotaFile)) {
            return {
                currentDay: this.getToday(),
                total: 0,
                users: {}
            };
        }

        const text = fs.readFileSync(this.quotaConfig.quotaFile, 'utf-8');
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
        if (userId === this.botOwner) {
            return
        }

        const quota = this.loadQuota();
        const userQuota = quota.users[userId] || 0;
        quota.total += tokens;
        quota.users[userId] = userQuota + tokens;
        this.saveQuota(quota);
    }

    checkTokens(userId: string, text: string) {
        if (userId === this.botOwner) {
            return
        }

        const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
        const tokens = tokenizer.encode(text).bpe.length;
        const quota = this.loadQuota();

        if (quota.total + tokens > this.quotaConfig.globalDailyTokenLimit) {
            throw new GlobalQuotaError(`Global quota exceeded`);
        }
        
        const userQuota = quota.users[userId] || 0;

        if (userQuota + tokens > this.quotaConfig.userDailyTokenLimit) {
            throw new UserQuotaError(`User quota exceeded`);
        }

    }

}