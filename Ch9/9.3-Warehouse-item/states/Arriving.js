import Delivered from "./Delivered.js";
import Stored from "./Stored.js";

export default class ArrivingState{
    constructor(item){
        this.item = item;
    }
    
    store(locationId){
        this.item.changeState(new Stored(this.item, locationId));
    }

    deliver(address){
        this.item.changeState(new Delivered(this.item, address))
    }

    describe(){
        return `Item ${this.item.id} is on its way to the warehouse`;
    }
}