import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import  {createCustomElement} from '@angular/elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    [
      {module: import('turingDisplay/Component'), elementName: 'turing-micro-frontend'},
      {module: import('enigma/Component'), elementName: 'enigma-micro-frontend'},
    ].forEach(({module, elementName}) => this.loadMFEModule(module, elementName));
  }

  loadMFEModule(_module: Promise<any>, _elementName: string): void {
    _module.then(
      module => {
        const customElement = createCustomElement(module.AppComponent, {injector: this.injector});
        customElements.define(_elementName, customElement);
      }
    );
  }

  title = 'shell';
}
