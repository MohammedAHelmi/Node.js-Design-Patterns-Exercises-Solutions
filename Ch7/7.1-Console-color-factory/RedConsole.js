import { ColorConsole } from "./ColorConsole.js";

export class RedConsole extends ColorConsole{
    log(text){
        console.log('\x1b[31m%s\x1b[0m', text); 
    }
}