// The releavant parts needed from the super execellent gl-matrix library.
// https://github.com/toji/gl-matrix/blob/master/src/quat.js
export function create() {
    let out = new Float32Array(4);
    out[3] = 1;
    return out;
  }

  export function fromEuler(out, x, y, z) {
    let halfToRad = (0.5 * Math.PI) / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;

    return out;
  }
  export function rotateX(out, a, rad) {
    rad *= 0.5;
    let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
    let bx = Math.sin(rad),
      bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  export function rotateY(out, a, rad) {
    rad *= 0.5;
    let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
    let by = Math.sin(rad),
      bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  export function rotateZ(out, a, rad) {
    rad *= 0.5;
    let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
    let bz = Math.sin(rad),
      bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  export function getAxisAngle(out_axis, q) {
    let rad = Math.acos(q[3]) * 2.0;
    let s = Math.sin(rad / 2.0);
    if (s > 0.000001) {
      out_axis[0] = q[0] / s;
      out_axis[1] = q[1] / s;
      out_axis[2] = q[2] / s;
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      out_axis[0] = 1;
      out_axis[1] = 0;
      out_axis[2] = 0;
    }
    return rad;
  }