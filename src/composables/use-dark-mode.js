import { reactive, onMounted, onBeforeUnmount, toRefs } from "vue";

export default function (options = { fallbackIsDark: false }) {
  const returnValue = reactive({
    error: false,
    isDark: options.fallbackIsDark,
  });

  const updateIsDark = (event) => {
    returnValue.isDark = event.matches;
  };

  onMounted(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    media.addEventListener("change", updateIsDark);

    updateIsDark(media);
  });

  onBeforeUnmount(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", updateIsDark);
  });

  return toRefs(returnValue);
}
