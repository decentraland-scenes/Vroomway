import * as utils from '@dcl-sdk/utils'
import { type GameController } from '../game.controller'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

export function randomIntFromInterval(
  min: number,
  max: number,
  exceptions?: number[]
): number {
  const getRandomNum = (): number =>
    Math.floor(Math.random() * (max - min + 1) + min)
  const randomNumber = getRandomNum()
  console.log(exceptions, randomNumber, 'barrel')

  // Verificar explícitamente si exceptions es null o undefined
  if (exceptions == null) return randomNumber

  // Return number that isn't the same as the exception(s)
  // E.g. Make sure 1 isn't included in [2, 5, 6] and if so run it back
  return exceptions.includes(randomNumber)
    ? randomIntFromInterval(min, max, exceptions)
    : randomNumber
}

const loadingImages = [
  // tide breaker
  'https://bafybeihjpaiabbxeds5kemqfoxlvtvf32xpdcwgffg5wtdl27enijhrb5e.ipfs.nftstorage.link/',
  // junkervan
  'https://bafybeieor3iberrv3mpedxm2bwvtinpmbxhv22o6vgubipzn6egf73xtla.ipfs.nftstorage.link/',
  // obsidian strike
  'https://bafybeielxkvuzuhcdty2lucjcklol76fk4iplcyheyu2l74hmcue3tbmcq.ipfs.nftstorage.link/',
  // hover cars
  'https://bafybeigwvggoibtlj6qt23rg4pe247trbbodpshnjpfnfeqlxikfm2on7i.ipfs.nftstorage.link/',
  // vroomvroom
  'https://bafybeia6vgt77hnz6thhiv4oesh2lhd2ychi2tfa5yo2vdhfoyxfziugzu.ipfs.nftstorage.link/',
  // pleather
  'https://bafybeigxzyexqg73omnlok2cuzs2ze2quilxamh7ykr6ausenmrsaaf4rm.ipfs.nftstorage.link/',
  // divinity
  'https://bafybeigocxgn54yl3r3dblug3njnzg6ka7a7ugdmklthm33kguf5zn6cxe.ipfs.nftstorage.link/',
  // machina
  'https://bafybeifr6a2wom5jephyfrqr5blwxlwq27pdiywtzm3aa3ddeec5lq532m.ipfs.nftstorage.link/',
  // Viridian Quake
  'https://bafybeifn4faatzqky45da53keahkxjw7on74huhww6lxcwqu44dy2g2khu.ipfs.nftstorage.link/',
  // v-wing
  'https://bafybeicqhib44zlqcdmcxtvxpawvhzxbbjt4oyjsrvh3uheordetijo3tq.ipfs.nftstorage.link/'
]

export class Loader {
  loader: any
  profile: string
  profileVisible: boolean
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.profile = ''
    this.profileVisible = false
  }

  createUI(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: canvasInfo.width,
          height: canvasInfo.height,
          justifyContent: 'center',
          positionType: 'absolute',
          position: { top: '0%', right: '0%' },
          display: this.profileVisible ? 'flex' : 'none'
        }}
      ></UiEntity>
    )
  }

  getProfile(): void {
    const profileTexture = loadingImages[randomIntFromInterval(1, 10)]
    this.profile = profileTexture
  }

  showLoader(time = 3200): void {
    this.getProfile()
    this.profileVisible = true
    utils.timers.setTimeout(() => {
      this.profileVisible = false
    }, time)
  }
}
