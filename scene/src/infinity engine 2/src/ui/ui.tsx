/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Transform, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'
import { CONFIG, PARCEL_UNIT_METERS } from '../config'
import { REGISTRY } from '../registry'
import { type TilesetGridDims, getGridDims } from '../terrain/terrainGrid'
import { MovesWithWorld } from '../world/worldMoveComponent'
import { createDebugUIButtons } from './ui-hud-debugger'

export function setupUi(): void {
  void createDebugUIButtons()

  ReactEcsRenderer.setUiRenderer(uiComponent)
}

const uiComponent = () => [playerPosComp(), ui.render()]

const playerPosComp = () => (
  <UiEntity
    uiTransform={{
      width: 400,
      height: 280,
      //  { top: 16, right: 0, bottom: 8 left: 270 },
      margin: '16px 0 8px 300px',
      // { top: 4, bottom: 4, left: 4, right: 4 },
      padding: 4,
      display: CONFIG.SHOW_GAME_DEBUG_INFO ? 'flex' : 'none'
    }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  >
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      uiBackground={{ color: Color4.fromHexString('#70ac76ff') }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 30,
          margin: '0px 0'
        }}
        uiBackground={{
          textureMode: 'center'
          // texture: {
          //   src: 'assets/logo-128.png',
          // },
        }}
        uiText={{
          value: 'Infinity Engine SDK7 Demo',
          fontSize: 18,
          color: Color4.Black()
        }}
      />
      <Label
        onMouseDown={() => {
          console.log('Player Position clicked !')
        }}
        value={`Debug Data: ${getPlayerPosition()}`}
        textAlign="middle-left"
        fontSize={16}
        uiTransform={{ width: '100%', height: '80%' }}
      />
    </UiEntity>
  </UiEntity>
)

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!REGISTRY.entities.moveWithWorldGrid)
    return ' playerPosition no moveWithWorldGrid yet'
  const terrainPos = Transform.getOrNull(
    REGISTRY.entities.moveWithWorldGrid.entity
  )
  if (!playerPosition) return ' playerPosition no data yet'
  if (!terrainPos) return 'terrainPos no data yet'
  const { x, y, z } = playerPosition.position
  const tx = terrainPos.position.x
  const ty = terrainPos.position.y
  const tz = terrainPos.position.z

  const gxm = CONFIG.infinEngineCenter.x - tx
  const gym = CONFIG.infinEngineCenter.y - ty
  const gzm = CONFIG.infinEngineCenter.z - tz

  // uncomment if can use this value
  // const pGridIdx = REGISTRY.spacePartioner.getGridIndex(x,y,z)
  const tGridIdx = REGISTRY.spacePartioner.getGridIndex(tx, ty, tz)
  const gGridIdx = REGISTRY.spacePartioner.getGridIndex(gxm, gym, gzm)
  // log("tGridIdx",tGridIdx)
  const gx = gxm / PARCEL_UNIT_METERS
  const gy = gym / PARCEL_UNIT_METERS
  const gz = gzm / PARCEL_UNIT_METERS

  const ceX = CONFIG.infinEngineCenter.x
  const ceY = CONFIG.infinEngineCenter.y
  const ceZ = CONFIG.infinEngineCenter.z

  const worldMoveGroup = engine.getEntitiesWith(MovesWithWorld, Transform)
  let ieTrackingCount = 0
  // TODO can be expensive, do few times a frame
  for (const o of worldMoveGroup) {
    ieTrackingCount++
  }

  let lastActiveGridCnt = -1
  if (REGISTRY.worldState && REGISTRY.worldState.currentActiveCells) {
    lastActiveGridCnt = REGISTRY.worldState.currentActiveCells.size
  }

  let loadRadius = -1
  let gridModelFolder = 'n/a'
  if (
    REGISTRY.SCENE_MGR._activeScene &&
    REGISTRY.SCENE_MGR._activeScene.sceneConfig
  ) {
    gridModelFolder =
      REGISTRY.SCENE_MGR._activeScene.sceneConfig.grid.tileSetConf.modelFolder
    loadRadius = REGISTRY.SCENE_MGR._activeScene.sceneConfig.grid.loadRadius
  }

  // TODO can be expensive, do few times a frame
  let gridDimData: TilesetGridDims
  if (
    REGISTRY.SCENE_MGR._activeScene &&
    REGISTRY.SCENE_MGR._activeScene.sceneConfig
  ) {
    gridDimData = getGridDims(
      REGISTRY.SCENE_MGR._activeScene.sceneConfig.grid.tileSetConf
    )
  } else {
    gridDimData = {} as any
  }

  return (
    `\nplayer.pos:{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(
      2
    )} }` +
    `\nterrain.pos:{X: ${tx.toFixed(2)}, Y: ${ty.toFixed(2)}, z: ${tz.toFixed(
      2
    )} }` +
    `\ngrid.pos(cell):{${gx.toFixed(1)},${gy.toFixed(1)},${gz.toFixed(1)}}` +
    // player position in grid
    `\ngrid.pos(meters):{${gxm.toFixed(1)},${gym.toFixed(1)},${gzm.toFixed(
      1
    )}}` +
    `\ngrid.index: terrain:${tGridIdx}, player:${gGridIdx}` +
    `\nMoveWithWorlds.Tracking: ${ieTrackingCount}` +
    `\ngrid.activeCells: ${lastActiveGridCnt} - grid.loadRadius(m): ${loadRadius}` +
    `\ngrid.models:${gridModelFolder}` +
    `\ngrid.size(m):${JSON.stringify(gridDimData.gridSizeMeters)}` +
    `\ngrid.size(tiles)${JSON.stringify(gridDimData.gridSize)}` +
    `\ngrid.cell.size(m):${JSON.stringify(gridDimData.cellSizeMeters)}` +
    `\ngrid.cell.ratio:${JSON.stringify(gridDimData.cellRatio)}`
  )
  // + `\nieCenter:{${ceX.toFixed(1)},${ceY.toFixed(1)},${ceZ.toFixed(1)}}`
}
