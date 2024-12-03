import { consoleColorFactory } from "./console-color-factory.js";

let coloredConsole = consoleColorFactory('red');
coloredConsole.log('This should be RED');

coloredConsole = consoleColorFactory('blue');
coloredConsole.log('This should be BLUE');

coloredConsole = consoleColorFactory('green');
coloredConsole.log('This should be GREEN');