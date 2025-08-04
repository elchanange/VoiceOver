export function trimBuffer(buf: Float32Array, start: number, end: number): Float32Array {
  return buf.slice(start, end);
}
