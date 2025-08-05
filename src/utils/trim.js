export function trimBuffer(buffer, start, end) {
  if (start < 0 || end > buffer.length || start >= end) {
    throw new Error('invalid trim range');
  }
  return buffer.slice(start, end);
}
