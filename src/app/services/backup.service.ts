import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { LogMessageService } from "./log-message.service";

interface BackupDocumentItem {
    timestamp: string;
    document: any;
}

interface IBackupTimers {
    [persistentKey: string]: number | undefined;
}

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    private backupTimers: IBackupTimers = {};
    private static BACKUP_LIFE_HOURS = 3;
    private static BACKUP_CLEANUP_INTERVAL_SECONDS = 30;

    public DEBUG: boolean = false;

    constructor(private logService: LogMessageService) { }

    public backupDocument(persistentKey: string, document: any) {
        const backupDocuments = BackupService.readList<BackupDocumentItem>(persistentKey);
        (`backup docs...${backupDocuments.length}`);
        backupDocuments.push({
            document,
            timestamp: moment().toISOString(true)
        });
        this.logService.print(this, `backuped docs...${backupDocuments.length}`);
        this.write(persistentKey, backupDocuments);
    }

    private static readList<T>(persistentKey: string): Array<T> {
      const serializedData = localStorage.getItem(persistentKey) || '[]';
      return JSON.parse(serializedData);
    }

    private write(persistentKey: string, data: any) {
        this.logService.print(this, 'writing...' + JSON.stringify(data), 50)
        localStorage.setItem(persistentKey, JSON.stringify(data));
    }

    public subscribeCleanUpOldBackupDocuments(persistentKey: string) {
        if (this.backupTimers[persistentKey]) {
            clearTimeout(this.backupTimers[persistentKey]);
        }
        this.cleanUpOldBackupDocuments(persistentKey);
        this.backupTimers[persistentKey] = window.setTimeout(() => {
            this.subscribeCleanUpOldBackupDocuments(persistentKey);
        }, BackupService.BACKUP_CLEANUP_INTERVAL_SECONDS * 1000)
    }

    public unsubscribeCleanUpOldBackupDocuments(persistentKey: string) {
        this.logService.print(this, 'unsubscribed cleanup loop')
        if (this.backupTimers[persistentKey]) {
            clearTimeout(this.backupTimers[persistentKey]);
            delete this.backupTimers[persistentKey];
        }
    }

    private cleanUpOldBackupDocuments(persistentKey: string) {
        const backupDocuments: Array<BackupDocumentItem> = BackupService.readList(persistentKey);
        const now = moment();
        const recentBackupDocuments = backupDocuments.filter(({ timestamp }) => {
            const backupTime = moment(timestamp);
            const duration = moment.duration(backupTime.diff(now));

            return Math.abs(duration.asHours()) <= BackupService.BACKUP_LIFE_HOURS;
        });
        this.logService.print(this, `cleaning up old backup docs...${backupDocuments.length} -> ${recentBackupDocuments.length}`);
        this.write(persistentKey, recentBackupDocuments);
    }
}
