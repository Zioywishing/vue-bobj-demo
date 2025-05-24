import type { ObjectManagerItemType } from "../types/ObjManagerItemTypes";
import ObjectManagerItem from "./ObjectManagerItem";

export default class ObjectManager {
    protected _objManagerItemArray: ObjectManagerItem[] = [];

    get objManagerItemArray() { return this._objManagerItemArray; }
    set objManagerItemArray(newObjManagerItemArray: ObjectManagerItem[]) { this._objManagerItemArray = newObjManagerItemArray; }

    constructor(initValue?: { [key: string]: any }) {
        for (const key in initValue) {
            const value = initValue[key];
            if (typeof value === "string") {
                this.addItem({ key, value, type: "String" });
            } else if (typeof value === "number") {
                this.addItem({ key, value, type: "Number" });
            } else if (typeof value === "boolean") {
                this.addItem({ key, value, type: "Boolean" });
            } else if (value instanceof Object) {
                if (value instanceof Uint8Array) {
                    this.addItem({ key, value, type: "Uint8Array" });
                } else if (value instanceof Array) {
                    this.addItem({ key, value: new ArrayObjectManager(value), type: "Array" });
                } else {
                    this.addItem({ key, value: new ObjectManager(value), type: "Object" });
                }
            } else if (value === null) {
                this.addItem({ key, value, type: "Null" });
            } else if (value === undefined) {
                this.addItem({ key, value, type: "Undefined" });
            }
        }
    }

    addItem(itemInfo: { key: string, value: any, type: ObjectManagerItemType }) {
        this.objManagerItemArray = [...this.objManagerItemArray, new ObjectManagerItem({ ...itemInfo, parent: this })];
    }

    generateObject() {
        return this.objManagerItemArray.reduce((curr, item) => {
            curr[item.key] = !["Object", "Array"].includes(item.type) ? item.value : (item.value as ObjectManager).generateObject();
            return curr;
        }, {} as { [key: string]: any });
    }
}

export class ArrayObjectManager extends ObjectManager {
    protected _objManagerItemArray: ObjectManagerItem[] = [];
    get objManagerItemArray() { return this._objManagerItemArray; }
    set objManagerItemArray(value: ObjectManagerItem[]) {
        value.sort((a, b) => {
            return Number(a.key) - Number(b.key);
        }).forEach((item, index) => {
            item.key = `${index}`;
        });
        this._objManagerItemArray = value;
    }

    constructor(initValue?: { type: ObjectManagerItemType, value: any }[]) {
        super();
        initValue && initValue.forEach((value) => {
            if (typeof value === "string") {
                this.addItem({ value, type: "String" });
            } else if (typeof value === "number") {
                this.addItem({ value, type: "Number" });
            } else if (typeof value === "boolean") {
                this.addItem({ value, type: "Boolean" });
            } else if (value instanceof Object) {
                if (value instanceof Uint8Array) {
                    this.addItem({ value, type: "Uint8Array" });
                } else if (value instanceof Array) {
                    this.addItem({ value: new ArrayObjectManager(value), type: "Array" });
                } else {
                    this.addItem({ value: new ObjectManager(value), type: "Object" });
                }
            } else if (value === null) {
                this.addItem({ value, type: "Null" });
            } else if (value === undefined) {
                this.addItem({ value, type: "Undefined" });
            }
        });
    }

    addItem(itemInfo: { value: any; type: ObjectManagerItemType; }): void {
        this.objManagerItemArray = [...this.objManagerItemArray, new ObjectManagerItem({ key: `${this.objManagerItemArray.length}`, ...itemInfo, parent: this })];
    }

    generateObject() {
        return this.objManagerItemArray.reduce((curr, item) => {
            curr.push(!["Object", "Array"].includes(item.type) ? item.value : (item.value as ObjectManager).generateObject());
            return curr;
        }, [] as any[]);
    }
}