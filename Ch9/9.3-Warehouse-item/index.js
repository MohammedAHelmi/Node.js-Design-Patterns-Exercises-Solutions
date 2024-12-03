import Item from "./Item.js";
import ArrivingState from "./states/Arriving.js";

const item = new Item('5821', (item) => new ArrivingState(item));
console.log(item.describe());

item.store('1ZH4');
console.log(item.describe());

item.deliver('1st Avenue, New York');
console.log(item.describe());