import { ServerApp } from './presentation/server';

(() => {
  main();
})();

function main() {
  new ServerApp().start();
}
