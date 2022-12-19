import { DateTime } from 'luxon';
import { guildSingleton } from '../decorators';


@guildSingleton()
export class CronService {

    schedule(dateTime: DateTime, callback: () => void) {
        const now = DateTime.local();
        const delay = dateTime.diff(now).as('milliseconds');
        setTimeout(callback, delay);
    }

}