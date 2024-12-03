import { ColorConsole } from "./ColorConsole.js";

export class GreenConsole extends ColorConsole{
    log(text){
        console.log('\x1b[32m%s\x1b[0m', text); 
    }
}