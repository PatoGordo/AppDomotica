import { defineStore } from "pinia";

export const useLoading = defineStore("loading", {
  state() {
    return {
      isOpen: false,
      hint: null,
    };
  },
  actions: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
      this.hint = null;
    },
  },
});
