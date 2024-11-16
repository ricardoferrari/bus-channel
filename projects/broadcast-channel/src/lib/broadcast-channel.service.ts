import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Broadcast } from '../broadcast';

export const BROADCAST_CHANNEL = new InjectionToken<BroadcastChannel>('Message Channel', {
  providedIn: 'root',
  factory: () => new BroadcastChannel('chute_de_mestre')
});

@Injectable({
  providedIn: 'root'
})
export class BroadcastChannelService implements OnDestroy {

  private message: BehaviorSubject<Broadcast | undefined> = new BehaviorSubject<Broadcast | undefined>(undefined);

  constructor(
    @Inject(BROADCAST_CHANNEL) public channel: BroadcastChannel,
  ) {
    this.channel.onmessage = this.onMessage.bind(this);
  }

  ngOnDestroy(): void {
    this.channel.close();
  }

  sendMessage(_content: any, _type: string) {
    const message: Broadcast = {
      type: _type,
      content: _content
    };
    console.log('send: ', _content);
    this.channel.postMessage(message);
  }

  onMessage(_message: MessageEvent) {
    this.message.next(_message.data);
  }

  messagesObservable(_type: string): Observable<any> {
    return this.message.pipe(
      filter(message => message?.type === _type),
      map(value => value?.content),
      filter(value => value != undefined),
    );
  }

}
