type Key = number | string;

/**
 * Helper class with purpose of subscribing on machine events and notifying subscribed users when this events occurs.
 */
export default class Notifier {
  private channels: { [key in Key]: ((...value: any[]) => void)[] };
  constructor() {
    this.channels = {};
  }

  addListener(channel: Key, cb: (...value: any[]) => void) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }
    this.channels[channel].push(cb);
  }

  removeListener(channel: Key, cb: (...value: any[]) => void) {
    if (this.channels[channel]) {
      this.channels[channel] = this.channels[channel].filter(
        (item) => item !== cb
      );
    }
  }

  notify(channel: Key, ...value: any[]) {
    for (let i = 0; i < this.channels[channel]?.length; i++) {
      this.channels[channel][i].apply(null, value);
    }
  }
}
