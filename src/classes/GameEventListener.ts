import { GameEvent } from "./GameEvent";

/**
 * Allows to register callbacks for specific events.
 */
export class GameEventListener {
  listeners: { [index: string]: any } = {};

  /**
   * Add an event listener for a specific event type.
   * @param {String} eventName - The event to listen for.
   * @param {Function} callback - The callback function to
   * be invoked when the event occurs.
   */
  on(eventName: string, callback: Function) {
    // Check if the event type already has listeners
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = [];
    }

    // Add the listener
    this.listeners[eventName].push(callback);
  }

  /**
   * Remove an event listener for a specific event type.
   * @param {String} eventName - The event to listen for.
   * @param {Function} callback - The callback function to be
   * invoked when the event occurs.
   */
  off(eventName: string | number, callback: Function) {
    const listeners: Function[] = this.listeners[eventName];
    if (listeners) {
      this.listeners[eventName] = listeners.filter(
        (cb: Function) => cb !== callback,
      );
      if (this.listeners[eventName].length === 0) {
        delete this.listeners[eventName];
      }
    }
  }

  /**
   * Executes all the callbacks listening to the event.
   * @param {GameEvent} event
   */
  trigger(event: GameEvent) {
    /**
     * @type {Function[]}
     */
    const listeners: Function[] = this.listeners[event.name];

    if (listeners) {
      listeners.forEach((callback: Function) => callback(event));
    }
  }
}
