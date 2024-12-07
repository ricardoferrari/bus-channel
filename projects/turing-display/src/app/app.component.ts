import { Component, OnDestroy, signal, WritableSignal, ChangeDetectionStrategy, AfterViewChecked, Signal, computed } from '@angular/core';
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

  receivedMessage: WritableSignal<{cyphertext: ArrayBuffer, iv:Uint8Array}> = signal({cyphertext: new ArrayBuffer(0), iv: new Uint8Array(0)});
  cryptedMessage: Signal<string> = computed(() => {
    const dec = new TextDecoder();
    return dec.decode(this.receivedMessage().cyphertext);
  });
  cryptedHexaMessage: Signal<string> = computed(() => {
    if (this.receivedMessage().cyphertext.byteLength > 0) {
        const view = new DataView(this.receivedMessage().cyphertext);
        let binary = '';
        for (let i = 0; i < view.byteLength; i++) {
          binary += view.getUint8(i).toString(16);
        }
        return binary;
    } else {
      return '';
    }
  });


  decryptedMessage: Signal<Promise<string>> = computed( async () => {
    if (this.receivedKey() && this.receivedMessage().cyphertext.byteLength > 0) {
      const cryptoKey = this.receivedKey()!;
      return this.decryptMessage(cryptoKey, this.receivedMessage().iv, this.receivedMessage().cyphertext)
        .then((decrypted) => decrypted)
        .catch((error) => {
          console.error('Error decrypting message:', error);
          return 'Not possible to decrypt message with the provided key.';
        });
    } else {
      return '';
    }
  });

  receivedKey: WritableSignal<CryptoKey | undefined> = signal(undefined);
  rawKey: WritableSignal<string> = signal('');
  cryptedHexaKey: Signal<string> = computed(() => {
    if (this.rawKey().length > 0) {
        let binary = '';
        for (let i = 0; i < this.rawKey().length; i++) {
          binary += this.rawKey().charCodeAt(i).toString(16);
        }
        return binary;
    } else {
      return '';
    }
  });

  constructor(
    private readonly broadcastChannelService: BroadcastChannelService,
  ) {
    this.subscription.add(
      // NOTE: Subscribes for messages on the 'crypto' channel
      this.broadcastChannelService.messagesObservable('crypto').subscribe((message: any) => {
        this.receivedMessage.set(message);
      })
    );

    // NOTE: Subscribes for keys on the 'public-key' channel
    this.subscription.add(
      this.broadcastChannelService.messagesObservable('public-key').subscribe(async (rawKey: any) => {
        this.rawKey.set(new TextDecoder().decode(rawKey));
        const importedKey = await window.crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, [
          "encrypt",
          "decrypt",
        ]);
        this.receivedKey.set(importedKey);
      })
    );
  }

  ngAfterViewChecked(): void {
    console.log('Mudou view!');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async decryptMessage(key: CryptoKey, iv: Uint8Array, ciphertext: ArrayBuffer): Promise<string> {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  }
}
