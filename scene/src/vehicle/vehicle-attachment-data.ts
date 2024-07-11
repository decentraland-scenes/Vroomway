/**     VEHICLE ATTACHMENT DATA
    this file contains examples of the types and defs for vroomway vehicle attachments.
    these should be treated as examples, not the final implementation (there may be some
    settings missing/additional properties required, such as particle texture settings).

    NOTE: when we get to SDK7 we'll also be able to attach items to character sub-bones too,
    this could make positioning effects much more dynamic (ex: add trails to the player's feet/shoes)

    NOTE: there is an assumption that the avatar/vehicle object replacement
    constructor has seperate definitions for the placement of attachments
    ex: a ground-based vehicle and a flying vehicle will have innately different 
    positions, scales, and rotations for each effects. if vehicles are not yet defined
    as data object, they should be before implmenting this system.
*/

import { RARITY_TYPE } from "../inventory/rarity-data";

/** offsets per scene */
export const ATTACHMENT_SCENE_OFFSETS = [
    { x: 0, y: 0, z: 0 },   // lobby scenes
    { x: -1, y: 1.35, z: 0 }  // race scenes
];
export const ATTACHMENT_SCENE_SCALES = [
    { x: 1, y: 1, z: 1 },   // lobby scenes
    { x: 0.5, y: 0.5, z: 0.5 }  // race scenes
];

/** defines all possible vehicle attachment types 
 *      used as placement filters on attachment inventory slots
 */
export enum VEHICLE_ATTACHMENT_TYPE {
    TRAILS = "TRAILS",
    HORN = "HORN",
    UNDERGLOW = "UNDERGLOW",
    THRUSTER = "THRUSTER",
    AURA = "AURA",
    BODY_KIT = "BODY_KIT",
}

/** defines all vehicle attachment pieces
 *  note: these are the ids that will be used to interact with the server, they should be unique
 *  denoters can exist here without being used in data entries (use this for pre-population)
 */
export enum VEHICLE_ATTACHMENT {

    // ###   TRAILS
    TRAIL_RED = "000",
    TRAIL_GREEN = "001",
    TRAIL_BLUE = "002",

    // ###   HORN
    HORN_00 = "100",
    HORN_01 = "101",
    HORN_02 = "102",

    // ###   UNDERGLOW
    UNDERGLOW_RED = "200",
    UNDERGLOW_GREEN = "201",
    UNDERGLOW_BLUE = "202",

    // ###   THRUSTERS (BOOSTER)
    THRUSTER_RED = "300",
    THRUSTER_GREEN = "301",
    THRUSTER_BLUE = "301",

    // ###   AURA
    AURA_RED = "400",
    AURA_GREEN = "401",
    AURA_BLUE = "402",

    // ###   BODYKIT (MODIFIED BODY)
    BODYKIT_00 = "500",
    BODYKIT_01 = "501",
    BODYKIT_02 = "502",
}

/** ensure standardization between all data objects 
 * (you can ignore this unless you want to mod the object's data def) 
 * 
 *  NOTE: can easily add bonuses by defining bonus type & interface then adding
 *  a set of bonuses tied to the vehicle 
 */
export type VehicleAttachmentDataObject = {
    // INDEXING
    Type: VEHICLE_ATTACHMENT_TYPE;  // type of attachment, used to define what inv slot/vehicle object piece this is parented under
    Rarity: RARITY_TYPE // rarity of attachment
    ID: VEHICLE_ATTACHMENT, // access id of object (used for registry access & server communications)
    // NFT (if source is empty anyone can wear it, otherwise the given urn must exist in the player's wearables)
    NFTSourceURN: string, // where the collection is hosted
    // DISPLAY 2D (inventory icon details)
    IconPos: { srcWidth: number, srcHeight: number, srcTop: number, srcLeft: number },
    // DISPLAY 3D
    Offset: {   // offsets applied to the attachable's parent object
        position: { x: number; y: number; z: number; };
        scale: { x: number; y: number; z: number; };
        rotation: { x: number; y: number; z: number; w: number };
    };
    Content: string; // path to attachment's content (audio, model, png, etc.)
}
/** registry of all vehicle attachments
 *  NOTE: there are a lot of commented out effects here that were used for testing purposes
 */
export const VehicleAttachmentData: VehicleAttachmentDataObject[] = [
    // ###   TRAILS
    {
        Type: VEHICLE_ATTACHMENT_TYPE.TRAILS,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.TRAIL_RED,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 0, y: -1, z: 0 }, scale: { x: 0.1, y: 0.1, z: 0.1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/trails/s1t1.1.glb"
    },/*
    {
        Type: VEHICLE_ATTACHMENT_TYPE.TRAIL,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.TRAIL_GREEN,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 0, y: -0.55, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/trails/trail-dust.glb"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.TRAIL,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.TRAIL_BLUE,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 0, y: -0.55, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/trails/trail-bubbles.glb"
    }, */

    // ###   HORN
    {
        Type: VEHICLE_ATTACHMENT_TYPE.HORN,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.HORN_00,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 118, srcLeft: 0 },
        Offset: { position: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "sounds/vehicles/vehicle-attachments/s2t1.1.mp3",
    },/*
    {
        Type: VEHICLE_ATTACHMENT_TYPE.HORN,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.HORN_01,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 118, srcLeft: 0 },
        Offset: { position: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "sounds/vehicles/vehicle-attachments/s2t1.1.mp3",
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.HORN,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.HORN_02,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 118, srcLeft: 0 },
        Offset: { position: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "sounds/vehicles/vehicle-attachments/s2t1.1.mp3",
    }, */

    // ###   UNDERGLOW
    {
        Type: VEHICLE_ATTACHMENT_TYPE.UNDERGLOW,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.UNDERGLOW_GREEN,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 236, srcLeft: 0 },
        Offset: { position: { x: 0, y: -2.25, z: 0 }, scale: { x: 5, y: 5, z: 5 }, rotation: { x: 90, y: 0, z: 0, w: 0 } },
        Content: "images/vehicles/vehicle-attachments/s3t1.1.png"
    },/*
    {
        Type: VEHICLE_ATTACHMENT_TYPE.UNDERGLOW,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.UNDERGLOW_RED,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 236, srcLeft: 0 },
        Offset: { position: { x: 0, y: -2.05, z: 0 }, scale: { x: 5, y: 5, z: 5 }, rotation: { x: 90, y: 0, z: 0, w: 0 } },
        Content: "images/vehicles/vehicle-attachments/s3t1.1.png"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.UNDERGLOW,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.UNDERGLOW_BLUE,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 236, srcLeft: 0 },
        Offset: { position: { x: 0, y: -2.05, z: 0 }, scale: { x: 5, y: 5, z: 5 }, rotation: { x: 90, y: 0, z: 0, w: 0 } },
        Content: "images/vehicles/vehicle-attachments/s3t1.1.png"
    }, */

    // ###   THRUSTER
    /* {
        Type: VEHICLE_ATTACHMENT_TYPE.THRUSTER,
        Rarity: RARITY_TYPE.EXOTIC,
        ID: VEHICLE_ATTACHMENT.THRUSTER_RED,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 0, y: -0.25, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-green.glb"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.THRUSTER,
        Rarity: RARITY_TYPE.LEGENDARY,
        ID: VEHICLE_ATTACHMENT.THRUSTER_GREEN,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 0, y: 0.0, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-red.glb"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.THRUSTER,
        Rarity: RARITY_TYPE.LEGENDARY,
        ID: VEHICLE_ATTACHMENT.THRUSTER_BLUE,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 0, y: 0.25, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-green.glb"
    }, */
    // ###   AURA
    /* {
        Type: VEHICLE_ATTACHMENT_TYPE.AURA,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.AURA_RED,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 1, y: -0.25, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-green.glb"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.AURA,
        Rarity: RARITY_TYPE.LEGENDARY,
        ID: VEHICLE_ATTACHMENT.AURA_GREEN,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 1, y: 0.0, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-red.glb"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.AURA,
        Rarity: RARITY_TYPE.LEGENDARY,
        ID: VEHICLE_ATTACHMENT.AURA_BLUE,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 1, y: 0.25, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-green.glb"
    }, */
    // ###   BODY KIT
    /* {
        Type: VEHICLE_ATTACHMENT_TYPE.BODY_KIT,
        Rarity: RARITY_TYPE.RARE,
        ID: VEHICLE_ATTACHMENT.BODYKIT_00,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 2, y: -0.25, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-green.glb"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.BODY_KIT,
        Rarity: RARITY_TYPE.LEGENDARY,
        ID: VEHICLE_ATTACHMENT.BODYKIT_01,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 2, y: 0.0, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-red.glb"
    },
    {
        Type: VEHICLE_ATTACHMENT_TYPE.BODY_KIT,
        Rarity: RARITY_TYPE.LEGENDARY,
        ID: VEHICLE_ATTACHMENT.BODYKIT_02,
        NFTSourceURN: "",
        IconPos: { srcWidth: 118, srcHeight: 118, srcTop: 0, srcLeft: 0 },
        Offset: { position: { x: 2, y: 0.25, z: 2 }, scale: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0, w: 0 } },
        Content: "models/vehicles/vehicle-attachments/primitive-square-green.glb"
    }, */
];