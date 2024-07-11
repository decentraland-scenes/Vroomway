/**
    contains definition details for all item rarity types. these rarities define
    an item's drop set from barrel salvaging, inventory's backplate draw colour,
    and number of available claims (if the item is a wearable/NFT). these rarities
    are standardized across all item types in the game.
    
    NOTE: atm this is only for backplate colours, but we can expand this down the line
    with more functionality (ex: name, desc, availability count)
*/

import { Color4 } from '@dcl/sdk/math'

/** defines all possible item rarities (b.c DCL doesn't let up process by value, these must be equal to themselves) */
export enum RARITY_TYPE {
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
  EXOTIC = 'EXOTIC',
  MYTHIC = 'MYTHIC',
  UNIQUE = 'UNIQUE'
}
/** defines the blueprint for rarity data */
export type RarityDataObject = {
  id: string // access id of object (used for registry access & should match enum)
  colour: Color4 // colour to be applied to the backplate
}
/** all rarity types */
export const RarityData: RarityDataObject[] = [
  { id: RARITY_TYPE.RARE, colour: Color4.Green() },
  { id: RARITY_TYPE.EPIC, colour: Color4.Blue() },
  { id: RARITY_TYPE.LEGENDARY, colour: Color4.Purple() },
  { id: RARITY_TYPE.EXOTIC, colour: Color4.Yellow() },
  { id: RARITY_TYPE.MYTHIC, colour: Color4.Red() },
  { id: RARITY_TYPE.UNIQUE, colour: Color4.Magenta() }
]
