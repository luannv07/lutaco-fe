import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiLoadingService {
  private readonly pendingRequests = signal(0);

  public readonly isLoading = computed(() => this.pendingRequests() > 0);

  startRequest(): void {
    this.pendingRequests.update((count) => count + 1);
  }

  finishRequest(): void {
    this.pendingRequests.update((count) => (count > 0 ? count - 1 : 0));
  }
}
