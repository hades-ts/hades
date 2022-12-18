import EventEmitter from 'events';
import { DateTime } from 'luxon';

export class CronService {
    hour: number;
    callback: () => void;

    protected target: DateTime;

    constructor(hour: number, callback: () => void) {
        this.callback = callback;
        this.hour = hour;

        const now = DateTime.now();

        if (now.hour < hour) {
            this.target = now.set({ hour, minute: 0, second: 0 });
        } else {
            this.target = now.plus({ days: 1 }).set({ hour, minute: 0, second: 0 });
        }

        setTimeout(() => {
            this.callback();
            this.target = this.target.plus({ days: 1 });
        }, this.target.diff(now).as('milliseconds'));
    }

}