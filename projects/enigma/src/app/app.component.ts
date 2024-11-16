import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BroadcastChannelService } from 'broadcast-channel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'enigma';

  public message = '';
  public key = '';

  constructor(private readonly broadcastChannelService: BroadcastChannelService) {}

  sendMessage(_message: string) {
    this.broadcastChannelService.sendMessage(_message, 'crypto');
  }

  sendKey(_message: string) {
    this.broadcastChannelService.sendMessage(_message, 'public-key');
  }
}
