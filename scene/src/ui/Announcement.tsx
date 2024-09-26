import { type Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label } from '@dcl/sdk/react-ecs'
import Canvas from './canvas/Canvas'

type AnnouncementProps = {
  visible: boolean
  color: Color4
  text: string
}

function Announcement({
  visible,
  text,
  color
}: AnnouncementProps): ReactEcs.JSX.Element {
  return (
    <Canvas>
      <Label
        uiTransform={{
          width: '100%',
          height: '100%',
          display: visible ? 'flex' : 'none'
        }}
        fontSize={40}
        font="sans-serif"
        value={text}
        color={color}
        textAlign="middle-center"
      />
    </Canvas>
  )
}

export default Announcement
