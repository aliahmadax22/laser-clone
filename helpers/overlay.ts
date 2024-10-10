import { reactive } from "vue";

export const overlay = reactive({
  isEnabled: false,
  show() {
    if (document?.body?.classList) {
      document.body.classList.add("waiting");
      this.isEnabled = true;
    }
  },
  hide() {
    if (document?.body?.classList) {
      document.body.classList.remove("waiting");
    }
    this.isEnabled = false;
  },
});
