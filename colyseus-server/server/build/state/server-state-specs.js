"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerUpsStatusUpdateResult = exports.TrackFeaturePosition = void 0;
exports.getTrackFeatureType = getTrackFeatureType;
exports.createTrackFeaturePositionConstructorArgs = createTrackFeaturePositionConstructorArgs;
function getTrackFeatureType(str) {
    return str;
}
function createTrackFeaturePositionConstructorArgs(position) {
    return {
        startSegment: position.startSegment,
        endSegment: position.endSegment,
        offset: position.offset,
        centerOffset: position.centerOffset,
    };
}
class TrackFeaturePosition {
    //entity:Entity
    constructor(args) {
        this.startSegment = args.startSegment;
        this.endSegment = args.endSegment;
        this.centerOffset = args.centerOffset;
        this.position = args.position;
        if (args.offset)
            this.offset = args.offset;
    }
}
exports.TrackFeaturePosition = TrackFeaturePosition;
class PowerUpsStatusUpdateResult {
    constructor() {
        this.activated = [];
        this.expired = [];
    }
}
exports.PowerUpsStatusUpdateResult = PowerUpsStatusUpdateResult;
