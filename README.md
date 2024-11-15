# BusChannel

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


### Comandos Angular criando microfrontends:

* Cria aplicação host: 
	$ ng new <nome> --create-application=false
  ou:
  $ ng new --no-create-application

* Cria aplicações remote: 
	$ ng g app <nome-do-filho>
	-> Nos apps remotos o ideal é ter um sub-módulo com o intúito de testar com mais facilidade, pois os modulos federados não podem levar o BrowserModule para o host
	$  ng generate module painel --module=app --project=painel --route=painel --routing=true

* Cria as bibliotecas customizadas e compartilhadas entre os microfrontends:
	$ ng generate library my-lib
* Personaliza o caminho do compiladdor para a lib:
	"compilerOptions": {
	    "paths": {
	      "auth-lib": [
	        // "dist/auth-lib"
	        "./projects/auth-lib/src/public-api.ts"
[Desta maneira a lib pode ser importada com: import { AuthLibModule } from 'auth-lib']

* Definir a lib como shared no webpack caso necessário:

* Declarar o módulo no host para recebê-lo de maneira mais simples do webpack:
	-> Criar o arquivo decl.d.ts com a declaração do módulo: declare module '<nome>/Module';
	-> Assim fica fácil utilizá-lo nas rotas:
		{
		    path: 'painel',
		    loadChildren: () => import('painel/Module').then(m => m.DashboardModule)
		},
	-> O router module raiz deve estar declarado como 'forRoot' para validar as rotas no remoto enquanto o do sub-módulo deve estar declarado como forChild.

* Para limpar o erro de "'import.meta' outside a module", acrescentar ao webpack.config.js apenas nos remotos para não quebrar o HMR (Hot Module Replacement):
	module.exports = {
	  output: {
	    scriptType: 'text/javascript'
	  }, ...


* Adiciona CUSTOM_ELEMENTS ao projeto selecionado (não é mais necessário após v13):
	$ ng add @angular/elements --project <nome-do-projeto>
  
* Adiciona module federation ao host e aos remotes:
	$ ng add @angular-architects/module-federation
	$ ng add @angular-architects/module-federation --project <nome-do-filho> --port 4201
	$ ng add @angular-architects/module-federation --project dashboard --port 4201
