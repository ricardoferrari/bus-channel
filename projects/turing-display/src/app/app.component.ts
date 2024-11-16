import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal, WritableSignal } from '@angular/core';
import { Broadcast, BroadcastChannelService } from 'broadcast-channel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'turing-display';

  receivedMessage: WritableSignal<string> = signal('');
  receivedKey: WritableSignal<string> = signal('');

  constructor(
    private readonly broadcastChannelService: BroadcastChannelService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.broadcastChannelService.messagesObservable('crypto').subscribe((message: string) => {
      console.log('received on display: ', message);
      this.receivedMessage.set(message);
      this.changeDetectorRef.detectChanges();
    });
    this.broadcastChannelService.messagesObservable('public-key').subscribe((key: string) => {
      console.log('received on display: ', key);
      this.receivedKey.set(key);
      this.changeDetectorRef.detectChanges();
    });
  }
}
