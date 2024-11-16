import { Component, OnDestroy, signal, WritableSignal, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { BroadcastChannelService } from 'broadcast-channel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy, AfterViewChecked {
  title = 'turing-display';

  private subscription: Subscription = new Subscription();

  receivedMessage: WritableSignal<string> = signal('');
  receivedKey: WritableSignal<string> = signal('');

  constructor(
    private readonly broadcastChannelService: BroadcastChannelService,
  ) {
    this.subscription.add(
      this.broadcastChannelService.messagesObservable('crypto').subscribe((message: string) => {
        this.receivedMessage.set(message);
      })
    );
    this.subscription.add(
      this.broadcastChannelService.messagesObservable('public-key').subscribe((key: string) => {
        this.receivedKey.set(key);
      })
    );
  }

  ngAfterViewChecked(): void {
    console.log('Mudou view!');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
