export default class Item{
    constructor(id, initStateFn){
        this.id = id;
        this.state = initStateFn(this);
    }

    store(locationId){
        this.state.store(locationId);
    }

    deliver(address){
        this.state.deliver(address);
    }

    describe(){
        return this.state.describe();
    }

    changeState(state){
        this.state = state;
    }
}