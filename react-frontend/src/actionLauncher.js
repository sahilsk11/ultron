export default function actionLauncher({ data, setMessage }) {
  if (data.intent === "unknown") setMessage("I don't quite understand.");
  if (data.code !== 200) {
    setMessage(data.message);
    return;
  }
  if (data.intent === "launch") {
    window.open(data.url);
    setMessage("Launching " + data.app + "...");
  } else {
    setMessage(data.message);
  }

}