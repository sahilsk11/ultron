export default function actionLauncher({ data, setMessage }) {
  let message = data.message;
  let intent = data.intent;
  if (data.intent === "unknown") message = "I don't quite understand";
  // if (data.code !== 200) {
  //   setMessage(data.message);
  //   return;
  // }
  if (data.intent === "launch") {
    window.open(data.url);
    //setMessage("Launching " + data.app + "...");
  }
  return { message, intent };
}