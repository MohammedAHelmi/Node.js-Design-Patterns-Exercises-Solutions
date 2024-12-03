import { ColorConsole } from "./ColorConsole.js";

export class BlueConsole extends ColorConsole{
    log(text){
        console.log('\x1b[34m%s\x1b[0m', text); 
    }
}