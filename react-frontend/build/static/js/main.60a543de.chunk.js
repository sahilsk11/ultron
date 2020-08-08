(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{14:function(e,t,n){},21:function(e,t,n){},22:function(e,t,n){},23:function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),r=n(7),i=n.n(r),c=(n(14),n(2)),o=n.n(c),l=n(8),u=n(3),p=n(1),m=n.n(p);n(21),n(22);function f(e){var t,n=e.message,a=e.transcript,r=e.startSession,i=e.closeSession,c=e.state,o=e.intentResponse,l=e.updateState;if("ambient"===c)t=function(e){var t=e.startSession;return s.a.createElement("img",{className:"pi-ambient",onClick:function(){return t()},src:"pi-ambient.gif",alt:""})}({startSession:r});else if("listening"===c)t=g({closeSession:i,greeting:"listening...",state:c,transcript:a});else if("processing"===c)t=g({closeSession:i,greeting:"thinking...",state:c});else{if("sleep"===c)return function(e){var t=e.updateState;return s.a.createElement("div",{className:"pi-sleep-container",onClick:function(){return t("ambient")}})}({updateState:l});"response"===c&&(t=function(e){var t=e.intentResponse,n=e.message,a=e.updateState;return s.a.createElement("div",{className:"pi-active-container",onClick:function(){return a("ambient")}},s.a.createElement("h1",{className:"pi-greeting"},s.a.createElement("em",null,t)),s.a.createElement("div",{className:"pi-transcript-wrapper"},s.a.createElement("p",{className:"pi-transcript"},s.a.createElement("em",null,n))))}({intentResponse:o,message:n,updateState:l}))}return s.a.createElement("div",{className:"pi-wrapper"},t,s.a.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap",rel:"stylesheet"}))}function g(e){var t=e.closeSession,n=e.greeting,a=e.state,r=e.transcript,i="listening"===a?s.a.createElement("img",{src:"./pi-listening.gif",className:"pi-listening",alt:""}):s.a.createElement("div",{className:"spinner"},s.a.createElement("div",{className:"bounce1"}),s.a.createElement("div",{className:"bounce2"}),s.a.createElement("div",{className:"bounce3"}));return s.a.createElement("div",{onClick:function(){return t()},className:"pi-active-container"},s.a.createElement("h1",{className:"pi-greeting"},s.a.createElement("em",null,n)),s.a.createElement("div",{className:"pi-transcript-wrapper"},s.a.createElement("p",{className:"pi-transcript"},s.a.createElement("em",null,r))),i)}var d=function(e){var t=e.transcript,n=e.setMessage,a=e.setIntent,s=e.updateState,r=e.onAudioFinish,i="https://api.sahilkapur.com",c="?transcript="+t.toLowerCase();try{fetch(i+"/setIntent"+c).then((function(e){if(200===e.status)return console.log(e),e.json();throw n("Error in request"),s("Error"),Error("Request rejected")})).then((function(e){var t=function(e){var t=e.data,n=e.updateState,a=t.message,s=t.intent;return"launch"===s?window.open(t.url):"hardwareSleepIntent"!==s&&"closeShopIntent"!==s||n("sleep"),{message:a,intent:s}}({data:e,updateState:s}),c=t.intent,o=t.message;a(c),n(o);var l=new Audio(i+"/audioFile?fileName="+e.fileName);s("response"),l.play(),l.addEventListener("ended",r)})).catch((function(e){console.error(e),s("error"),n(e)}))}catch(o){alert()}};var v=function(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],r=t[1],i=Object(p.useSpeechRecognition)(),c=i.listening,g=i.transcript,v=i.resetTranscript,h=Object(a.useState)("ambient"),E=Object(u.a)(h,2),b=E[0],w=E[1],S=Object(a.useState)("Hello, Sahil."),N=Object(u.a)(S,2),j=N[0],O=N[1],k=Object(a.useState)(null),y=Object(u.a)(k,2),R=y[0],L=y[1];Object(a.useEffect)((function(){m.a.browserSupportsSpeechRecognition()||alert("Unsupported Browser")}),[]),"sleep"===b&&c?m.a.stopListening():c||m.a.startListening({continuous:!0});var C=function(){O("Go ahead..."),r(new Date),w("listening"),m.a.startListening({continuous:!0})},I=Object(a.useRef)(b);I.current=b;var M=function(){var e=Object(l.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:O("processing..."),w("processing"),t=function(){v(),w("response"),setTimeout((function(){"response"===I.current&&w("ambient")}),1e4)},d({transcript:g,setMessage:O,setIntent:L,updateState:w,onAudioFinish:t});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(a.useEffect)((function(){return r(new Date)}),[g]),"listening"!==b&&(g.toLowerCase().includes("ultron")?(v(),C()):c&&"response"===b&&g.toLowerCase().includes("clear")&&(v(),w("ambient"))),function(e,t){var n=Object(a.useRef)();Object(a.useEffect)((function(){n.current=e}),[e]),Object(a.useEffect)((function(){if(null!==t){var e=setInterval((function(){n.current()}),t);return function(){return clearInterval(e)}}}),[t])}((function(){""!==g&&"listening"===b&&((new Date-n)/1e3>2&&M())}),""!==g&&"listening"===b?1e3:null);var _={message:j,intentResponse:R,transcript:"listening"===b?g:"",startSession:C,state:b,updateState:w},A=window.location.search;return"pi"===new URLSearchParams(A).get("device")?f(_):function(e){var t=e.message,n=e.listening,a=e.stopListening,r=e.startSession,i=e.transcript;return s.a.createElement("div",{className:"app-container"},s.a.createElement("h2",{className:"greeting"},t),s.a.createElement("div",{className:"voice-icon-wrapper",onClick:function(){n?a():r({continuous:!0})}},s.a.createElement("img",{className:"voice-icon",src:"https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif",alt:""})),s.a.createElement("p",{className:"transcript"},s.a.createElement("em",null,i)),s.a.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap",rel:"stylesheet"}))}(_)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(v,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t,n){e.exports=n(23)}},[[9,1,2]]]);
//# sourceMappingURL=main.60a543de.chunk.js.map