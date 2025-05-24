import type { ObjectManagerItemType } from "../types/ObjManagerItemTypes";
import ObjectManager, { ArrayObjectManager } from "./ObjectManager";

const defaultValue = {
    String: () => "",
    Number: () => 0,
    Boolean: () => true,
    Object: () => new ObjectManager(),
    Array: () => new ArrayObjectManager(),
    Null: () => null,
    Undefined: () => undefined,
    Uint8Array: () => new Uint8Array(0),
}

export default class ObjectManagerItem {
    id = Math.random();
    private _key: string;
    private _value: any;
    private _type: ObjectManagerItemType;
    parent: ObjectManager;
    constructor(option: {
        key: string,
        value: any,
        type: ObjectManagerItemType,
        parent: ObjectManager
    }) {
        this.parent = option.parent;
        this._key = this._generateAvailableKey(option.key);
        this._value = option.value;
        this._type = option.type;
    }

    private _generateAvailableKey(newKey: string): string {
        return this.parent.objManagerItemArray.reduce((acc, item) => acc && item._key !== newKey, true) ? this._key = newKey : this._generateAvailableKey(`${newKey}_`);
    }

    get key() {
        return this._key;
    }

    set key(newKey: string) {
        newKey !== this._key && (this._key = this._generateAvailableKey(newKey));
    }

    get value() {
        return this._value;
    }

    set value(newValue: any) {
        this._value = newValue;
    }

    get type() {
        return this._type;
    }

    set type(newType: ObjectManagerItemType) {
        if (newType === this._type) return;
        this._type = newType;
        this._value = defaultValue[newType]();
    }

    delete() {
        this.parent.objManagerItemArray = this.parent.objManagerItemArray.filter(item => item.id !== this.id);
    }
}