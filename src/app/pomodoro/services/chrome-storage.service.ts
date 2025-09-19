import { ChromeStorageKeys } from '@/app/shared/enums/chrome-storage-keys.enum';
import { Injectable } from '@angular/core';
import { PomodoroStatus } from '@enums/pomodoro-status.enum';
import { Observable } from 'rxjs';

const {POMODORO_STATUS} = ChromeStorageKeys;

@Injectable({providedIn: 'root'})
export class ChromeStorageService {

  public storageChanges$ = new Observable<{
    areaName: string;
    key: string;
    oldValue: any;
    newValue: any;
  }>(subscriber => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        subscriber.next({ areaName, key, oldValue, newValue });
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return () => chrome.storage.onChanged.removeListener(listener);
  })

  public set(key: ChromeStorageKeys, value: string): Promise<void> {
    return chrome.storage.local.set({ [key]: value });
  }

  public async get(key: ChromeStorageKeys): Promise<string | number | undefined> {
    const result = await chrome.storage.local.get(key);
    return result[key];
  }
}
