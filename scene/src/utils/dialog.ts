import { type Dialog } from 'dcl-npc-toolkit'
// import { missions } from "./missions";

export const YoYoDialog1: Dialog[] = [
  {
    text: "Greetings Racer! I'm YoYo - a master Racer. Welcome to the most advanced Vehicle Haven in Decentraland - Vroomway!"
  },
  {
    text: 'Vroomway is all about racing, gathering materials, and crafting vehicles.'
  },
  {
    text: 'We have a ton of vehicles for Racers to craft and enjoy.'
  },
  {
    text: 'Vroomway is a spaceship that is from the planet Volo. We are a species of perfect symbiosis between organic life and machines.'
  },
  {
    text: 'Each portal will take you to a different part of the ship that serves its own purpose to keep this ship running.'
  },
  {
    text: 'We are here to share our technology with Decentraland and enhance the way you navigate the world with our amazing line of vehicles!'
  },
  {
    text: 'Continue with your missions and discover the whole ship for a reward!',
    isQuestion: true,
    buttons: [
      {
        label: `Get Reward`,
        goToDialog: 7,
        triggeredActions: () => {
          // missions.checkAndUnlockCampaignMission("yoyo");
        }
      }
    ]
  },
  { text: 'We look forward to your journey here with us.', isEndOfDialog: true }
]

export const AssidMaryDialog1: Dialog[] = [
  {
    text: "Hello Racer! The name's Assid Mary. I'm in charge of the Scrapyard here. Try not to get anything dirty!"
  },
  {
    text: 'Whenever you complete races or achievements you might find Cargo. These are loot boxes that only I know how to open.'
  },
  {
    text: 'So whenever you find them bring them to me and Ill crack them open for you.'
  },
  {
    text: 'There are 3 types of Cargo: Small, Medium, Large. The bigger the Cargo, the bigger the reward.'
  },
  {
    text: 'Go clean up some barrels now will ya.\n\nPress E to claim your prize',
    isQuestion: true,
    buttons: [
      {
        label: `Claim`,
        goToDialog: 'End'
        // triggeredActions: () => missions.checkAndUnlockCampaignMission("assidMary")
      }
    ]
  },
  {
    name: 'End',
    text: 'Stay safe here in the stacks and stay away from the ledges!',
    isEndOfDialog: true
  }
]

export const TulioDialog1: Dialog[] = [
  {
    text: 'Hola Racer! My name is Tulio and I am the leader of these racing game modes. Vroomway features 3 different game modes!'
  },
  {
    text: "Solo-Sprint is our entry level game mode. It's a point A to point B sprint. Collect as many coins as you can and reach the end of the course as fast as you can!"
  },
  {
    text: 'Demo Derby is our demolition elimination game mode. This game mode requires at least 3 players to start. Eliminate other players while surviving the environment!'
  },
  {
    text: 'Fuego Circuits is a lap racing game mode that supports up to 8 players. Race laps either solo or alongside your friends to get the fastest time and win 1st place!'
  },
  {
    text: "Whenever you're ready click the Start Coin for Solo-Sprints and show us what you got!\n\nPress E to claim your prize",
    isQuestion: true,
    buttons: [
      {
        label: `Claim`,
        goToDialog: 'End'
        // triggeredActions: () => missions.checkAndUnlockCampaignMission("visitRacehub")
      }
    ]
  },
  {
    name: 'End',
    text: 'Be sure to keep an eye on the leaderboards behind me!',
    isEndOfDialog: true
  }
]
