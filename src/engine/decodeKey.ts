/**
 * Decode a buffer of bytes from raw stdin into a friendly key name.
 * Returns 'unknown' for anything we don't recognize.
 *
 * Examples:
 *   Buffer.from([0x61])                   → 'a'
 *   Buffer.from([0x41])                   → 'A'
 *   Buffer.from([0x03])                   → 'ctrl-c'
 *   Buffer.from([0x1b])                   → 'escape'
 *   Buffer.from([0x0d])                   → 'enter'
 *   Buffer.from([0x20])                   → 'space'
 *   Buffer.from([0x1b, 0x5b, 0x41])       → 'up'
 *   Buffer.from([0x1b, 0x5b, 0x42])       → 'down'
 *   Buffer.from([0x1b, 0x5b, 0x43])       → 'right'
 *   Buffer.from([0x1b, 0x5b, 0x44])       → 'left'
 */
export function decodeKey(chunk: Buffer): string {
  if (chunk.length === 1){
    const b = chunk[0]
    if(b === 0x1b){
      return "escape";
    }else if(b === 0x03){
      return "ctrl-c"
    } else if(b===0x0d){
      return "enter";
    } else if(b! >= 31 && b! <= 126){
      return String.fromCharCode(b!);
    }
  }
  return "unknown";
  // TODO: Handle single-byte chunks: control keys, printable ASCII.
  // TODO: Handle 3-byte escape sequences for arrow keys.
  // TODO: Return 'unknown' for anything else.
}
