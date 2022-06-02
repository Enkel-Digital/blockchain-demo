import { defineStore } from "pinia";

// Need to define type of State object externally, to define optional properties
interface State {
  notif: boolean;
  notifContent: string;
  autoCloseTimeout?: number;
}

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("main", {
  // arrow function recommended for full type inference
  state: (): State => ({
    // all these properties will have their type inferred automatically
    notif: false,
    notifContent: "",
    autoCloseTimeout: undefined,
  }),

  // https://pinia.vuejs.org/core-concepts/actions.html
  actions: {
    clearTimeoutIfAny() {
      // If there is already an auto close timeout set, remove it,
      // So that the auto close will not close a newly requested banner
      if (this.autoCloseTimeout) {
        clearTimeout(this.autoCloseTimeout);
        this.autoCloseTimeout = undefined;
      }
    },

    showNotif(notifContent: string, timeout = 3000) {
      this.clearTimeoutIfAny();

      this.notif = true;
      this.notifContent = notifContent;

      // Auto close notif banner after timeout
      this.autoCloseTimeout = setTimeout(() => (this.notif = false), timeout);
    },

    clearNotif() {
      this.clearTimeoutIfAny();
      this.notif = false;
    },

    /**
     * Write a string to the user's clipboard and show a notification for it
     */
    copy(text: string, showNotif = true) {
      navigator.clipboard
        .writeText(text)
        .then(() => showNotif && this.showNotif("Copied to clipboard!"));
    },
  },
});
