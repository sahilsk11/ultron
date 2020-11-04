export default function actionLauncher({ data, updateState, resetTranscript }) {
  const { message, intent } = data;
  resetTranscript();
  if (intent === "launch" || intent === "showSourceCodeIntent") {
    window.open(data.url);
  } else if (intent === "hardwareSleepIntent" || intent === "closeShopIntent") {
    updateState("sleep");
  } else if (intent === "pullLatestVersion") {
    if (data.update) {
      setTimeout(() => window.location.reload(), 6000);
    }
  } else if (intent == "clearIntent") {
    updateState("ambient");
  }

  return { message, intent };
}