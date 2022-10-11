import { reactive, onMounted, onBeforeUnmount, toRefs } from 'vue';

export default function (options = { fallbackIsDark: false }) {
  const returnValue = reactive({
    error: false,
    isDark: options.fallbackIsDark,
    callbacks: new Map(),
  });

  const updateIsDark = (event) => {
    returnValue.isDark = event.matches;

    for (const callback of returnValue.callbacks.values()) if (typeof callback === 'function') callback(returnValue);
  };

  const onColorSchemeChange = (callback) => {
    returnValue.callbacks.set(callback, callback);

    return () => offColorSchemeChange(callback);
  };

  const offColorSchemeChange = (callback) => {
    returnValue.callbacks.delete(callback);
  };

  onMounted(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    media.addEventListener('change', updateIsDark);

    updateIsDark(media);
  });

  onBeforeUnmount(() => {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateIsDark);

    returnValue.callbacks.clear();

    updateIsDark({ matches: options.fallbackIsDark });
  });

  return { ...toRefs(returnValue), onColorSchemeChange, offColorSchemeChange };
}
