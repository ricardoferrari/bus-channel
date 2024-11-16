import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

export const BROADCAST_CHANNEL = new InjectionToken<BroadcastChannel>('Message Channel');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    { provide: BROADCAST_CHANNEL, useFactory: () => new BroadcastChannel('alan-turing') }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
