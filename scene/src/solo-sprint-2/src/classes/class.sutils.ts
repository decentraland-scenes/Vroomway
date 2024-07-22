// General utility functions

import { type Quaternion, Vector3 } from "@dcl/sdk/math"


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Sutils {

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	static vectorInvertHorizontal(vec: Vector3) {
		return Vector3.create(vec.x * -1, vec.y, vec.z * -1)
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	static transformScaleOne(position:Vector3,scale:Vector3,rotation: Quaternion) {
		return {
			position,
			scale: Vector3.create(1,1,1),
			rotation
		}
	}


}
