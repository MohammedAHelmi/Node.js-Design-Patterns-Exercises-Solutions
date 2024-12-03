import { RedConsole } from "./RedConsole.js";
import { GreenConsole } from "./GreenConsole.js";
import { BlueConsole } from "./BlueConsole.js";

export const consoleColorFactory = function(color){
    switch(color){
        case 'red': return new RedConsole();
        case 'green': return new GreenConsole();
        case 'blue': return new BlueConsole();
    }
}