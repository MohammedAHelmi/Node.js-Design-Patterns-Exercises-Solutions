export default class Delivered{
    constructor(item, address){
        this.item = item;
        this.address = address;
    }

    store(){}

    deliever(){}

    describe(){
        return `Item ${this.item.id} was delivered to ${this.address}`;
    }
}