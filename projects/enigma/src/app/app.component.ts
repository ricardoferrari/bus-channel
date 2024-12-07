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
  public crypted_message = '';
  public key: CryptoKey | undefined;

  constructor(private readonly broadcastChannelService: BroadcastChannelService) {}

  sendMessage(_message: string) {
    this.cryptMessage(_message).then((crypted_message) => {
      const dec = new TextDecoder();
      this.crypted_message = dec.decode(crypted_message.cyphertext);
      this.broadcastChannelService.sendMessage(crypted_message, 'crypto');
    });
  }

  sendKey() {
    this.generateKey().then(async (key) => {
      this.key = key;
      const exportedKey:ArrayBuffer = await window.crypto.subtle.exportKey("raw", key);
      this.broadcastChannelService.sendMessage(exportedKey, 'public-key');
    });
  }

  private async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async cryptMessage(message: string): Promise<{cyphertext: ArrayBuffer, iv:Uint8Array}> {
    if (!this.key) {
      return {cyphertext: new ArrayBuffer(0), iv: new Uint8Array(0)};
    }

    // create a random 96-bit initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // encode the message as an ArrayBuffer
    const enc = new TextEncoder();
    const encoded = enc.encode(message);

    // encrypt the message
    return {
      cyphertext: await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        encoded
      ),
      iv: iv
    }
  }
}
