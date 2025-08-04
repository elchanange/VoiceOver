export function trimBuffer(buffer: Float32Array, start: number, end: number): Float32Array {
  if (start < 0 || end > buffer.length || start >= end) {
    throw new Error('invalid trim range');
  }
  return buffer.slice(start, end);
}
