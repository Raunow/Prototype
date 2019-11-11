import { performance } from "perf_hooks";

// let store = {};
// let copy = {};

// for (let index = 0; index < 8000; index++) {
// 	store[index] = index.toString();

// }

let filters = {
	Folders: true,
	Buildings: true,
	Objects: true,
	Meters: true,
	ObjectTrees: true,
	MeterTrees: true
}

let keysAreTrue = true;
let t1 = performance.now();
let t2 = performance.now();

let result = t2 - t1;

console.log(result.toString(), keysAreTrue)