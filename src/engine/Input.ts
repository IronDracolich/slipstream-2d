import { EventEmitter } from 'events';
import { InputSource } from './InputSource';
import {decodeKey} from './decodeKey'
import { emitKeypressEvents} from "readline";
import process from "node:process"
/**
 * Reads keyboard input from a data-event source (stdin by default)
 * and exposes it via a tick-friendly polling API.
 */
export class Input implements InputSource {
  private pressedAt: Map<string, number>
  private justPressed: Set<string>
  private holdTimeoutMs: number
  private source: NodeJS.ReadableStream | EventEmitter
  private dataListener: (chunk: Buffer) => void
  private ownsStdin: boolean

  /**
   * @param source          Where to read from. Defaults to process.stdin.
   *                        Pass an EventEmitter in tests to simulate input.
   * @param holdTimeoutMs   How long after the last keypress to keep isKeyPressed true.
   *                        Must be larger than the OS key-repeat interval. Default 150.
   */
  constructor(source: NodeJS.ReadableStream | EventEmitter = process.stdin, holdTimeoutMs: number = 150) {
    this.holdTimeoutMs = 300
    this.source = source
    this.ownsStdin = false;
    this.pressedAt = new Map()
    this.justPressed = new Set<string>
    if (source === process.stdin){
      process.stdin.setRawMode(true);
      process.stdin.resume();
      this.ownsStdin = true;
    }
    this.dataListener = this.handleKeyPress.bind(this);
    source.on('data', this.dataListener);

    // TODO: Initialize state.
    // TODO: If source is the real process.stdin AND it is a TTY,
    //         call setRawMode(true) and resume() on it. Set ownsStdin = true.
    //       Otherwise, don't touch stdin — the source is a mock.
    // TODO: Create the data listener. When a chunk arrives:
    //         a) decode it with decodeKey()
    //         b) if the key was NOT already pressed, add it to justPressed
    //         c) update pressedAt[key] to now
    // TODO: Subscribe the listener to source.on('data', ...).
  }

  handleKeyPress(chunk: Buffer): void {
    //console.log(chunk.length, 'bytes:', Array.from(chunk).map(b => b.toString(16)).join(' '));
    const letters = "abcdefghijklmnopqrstuvw";
    const key = decodeKey(chunk);
    if(letters.includes(key.toLowerCase())) {
      this.justPressed.add(key.toLowerCase());
      this.pressedAt.set(key.toLowerCase(), Date.now())
      //console.log(this.pressedAt)

    }

    if (chunk[0] === 0x03) process.exit(0); // Ctrl+C
  }

  isKeyPressed(key: string): boolean {
    if(this.pressedAt.has(key) && (Date.now().valueOf() - this.pressedAt.get(key)! <= this.holdTimeoutMs)){
     // console.log("detected keypress " + key)
      return true;

    } else {
      return false;
    }

    // TODO: Return true if pressedAt has this key AND
    //       (now - pressedAt[key]) <= holdTimeoutMs.
    //       Otherwise false.
  }

  wasJustPressed(key: string): boolean {
    // TODO: Return justPressed.has(key).
    return this.isKeyPressed(key);
  }

  endFrame(): void {
    this.justPressed = new Set();
    // TODO: Clear the justPressed set.
    // Note: do NOT clear pressedAt — we need timestamps to persist across frames.
  }

  close(): void {
    if (this.ownsStdin){
      process.stdin.setRawMode(false)
      process.stdin.pause()
    }
    // TODO: Remove the data listener from source.
    // TODO: If ownsStdin, setRawMode(false) and pause().
  }
}
