export default function actionLauncher({ data, updateState }) {
  const { message, intent } = data;

  if (intent === "launch") {
    window.open(data.url);
  } else if (intent === "hardwareSleepIntent" || intent === "closeShopIntent") {
    updateState("sleep");
  }

  return { message, intent };
}