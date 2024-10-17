"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3StateSupport = void 0;
class Vector3StateSupport {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copyFrom(vec) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }
}
exports.Vector3StateSupport = Vector3StateSupport;
