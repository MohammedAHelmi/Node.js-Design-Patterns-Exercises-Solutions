import Delivered from "./Delivered.js";

export default class Stored{
    constructor(item, locationId){
        this.item = item;
        this.locationId = locationId;
    }

    store(){}

    deliver(address){
        this.item.changeState(new Delivered(this.item, address));
    }

    describe(){
        return `Item ${this.item.id} is stored in location ${this.locationId}`;
    }
}