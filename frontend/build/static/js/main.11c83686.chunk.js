(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{25:function(e,t,n){e.exports=n(44)},30:function(e,t,n){},37:function(e,t,n){},38:function(e,t,n){},44:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(20),i=n.n(s),c=(n(30),n(12)),o=n(21),l=n(9),u=n.n(l),p=n(22),m=n(6),f=n(8),g=n.n(f);n(37),n(38);function d(e){var t,n=e.message,a=e.transcript,s=e.startSession,i=e.closeSession,c=e.state,o=e.intentResponse,l=e.updateState,u={sleepClock:h({updateState:l})};return"ambient"===c?t=function(e){var t=e.startSession;return r.a.createElement("img",{className:"pi-ambient",onClick:function(){return t()},src:"pi-ambient.gif",alt:""})}({startSession:s}):"listening"===c?t=v({closeSession:i,greeting:"listening...",state:c,transcript:a}):"processing"===c?t=v({closeSession:i,greeting:"thinking...",state:c}):"sleep"===c?t=u.sleepClock:"response"===c&&(t=function(e){var t=e.intentResponse,n=e.message,a=e.updateState;return r.a.createElement("div",{className:"pi-active-container",onClick:function(){return a("ambient")}},r.a.createElement("h1",{className:"pi-greeting"},r.a.createElement("em",null,t)),r.a.createElement("div",{className:"pi-transcript-wrapper"},r.a.createElement("p",{className:"pi-transcript"},r.a.createElement("em",null,n))))}({intentResponse:o,message:n,updateState:l})),r.a.createElement("div",{className:"pi-wrapper"},t,r.a.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap",rel:"stylesheet"}))}function v(e){var t=e.closeSession,n=e.greeting,a=e.state,s=e.transcript,i="listening"===a?r.a.createElement("img",{src:"./pi-listening.gif",className:"pi-listening",alt:""}):r.a.createElement("div",{className:"spinner"},r.a.createElement("div",{className:"bounce1"}),r.a.createElement("div",{className:"bounce2"}),r.a.createElement("div",{className:"bounce3"}));return r.a.createElement("div",{onClick:function(){return t()},className:"pi-active-container"},r.a.createElement("h1",{className:"pi-greeting"},r.a.createElement("em",null,n)),r.a.createElement("div",{className:"pi-transcript-wrapper"},r.a.createElement("p",{className:"pi-transcript"},r.a.createElement("em",null,s))),i)}function h(e){var t=e.updateState,n=Object(a.useState)(""),s=Object(m.a)(n,2),i=s[0],c=s[1];return b((function(){var e=(new Date).toLocaleTimeString().toString(),t=e.lastIndexOf(":"),n=e.substring(0,t)+e.substring(t+3);c(n)}),1e3),r.a.createElement("div",{onClick:function(){return t("ambient")}},r.a.createElement("h3",{className:"pi-clock"},i))}function b(e,t){var n=Object(a.useRef)();Object(a.useEffect)((function(){n.current=e}),[e]),Object(a.useEffect)((function(){if(null!==t){var e=setInterval((function(){n.current()}),t);return function(){return clearInterval(e)}}}),[t])}function E(){var e=Object(a.useState)(""),t=Object(m.a)(e,2),n=t[0],s=t[1];return r.a.createElement("div",null,r.a.createElement("input",{value:n,onChange:function(e){return s(e.target.value)}}),r.a.createElement("button",null,"send"))}var S=n(23),w=n(1);function j(){var e=Object(a.useState)(null),t=Object(m.a)(e,2),n=t[0],s=t[1],i=Object(f.useSpeechRecognition)(),l=i.listening,v=i.transcript,h=i.resetTranscript,b=Object(a.useState)("ambient"),E=Object(m.a)(b,2),S=E[0],w=E[1],j=Object(a.useState)("Hello, Sahil."),y=Object(m.a)(j,2),N=y[0],k=y[1],I=Object(a.useState)(null),L=Object(m.a)(I,2),C=L[0],R=L[1],T=["okay ultron","jarvis"];Object(a.useEffect)((function(){g.a.browserSupportsSpeechRecognition()||alert("Unsupported Browser")}),[]),console.log(S),"sleep"===S&&l?g.a.stopListening():"sleep"===S||l||g.a.startListening({continuous:!0});var _=function(){h(),k("Go ahead..."),s(new Date),w("listening")},M=function(){var e=Object(p.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:k("processing..."),w("processing"),t=function(){h(),g.a.startListening({continuous:!0})},g.a.stopListening(),O({transcript:v,resetTranscript:h,setMessage:k,setIntent:R,updateState:w,onAudioFinish:t});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(a.useEffect)((function(){s(new Date)}),[v]);"listening"!==S&&(!function(e){console.log(e);var t,n=Object(o.a)(T);try{for(n.s();!(t=n.n()).done;){var a=t.value;if(e.includes(a))return!0}}catch(r){n.e(r)}finally{n.f()}return!1}(v.toLocaleLowerCase())?l&&"response"===S&&v.toLowerCase().includes("clear")&&(h(),w("ambient")):(h(),_())),function(e,t){var n=Object(a.useRef)();Object(a.useEffect)((function(){n.current=e}),[e]),Object(a.useEffect)((function(){if(null!==t){var e=setInterval((function(){n.current()}),t);return function(){return clearInterval(e)}}}),[t])}((function(){if(""!==v&&"listening"===S){var e=(new Date-n)/1e3,t=2;v.includes("add weight")&&!v.includes("send")&&(t=60),e>t&&M()}}),""!==v&&"listening"===S?1e3:null);var A={message:N,intentResponse:C,transcript:"listening"===S?v:"",startSession:_,state:S,updateState:w,updateMessage:k},D={resetTranscript:h,setMessage:k,setIntent:R,updateState:w,onAudioFinish:function(){return h()}},F=window.location.search;return"pi"===new URLSearchParams(F).get("device")?d(A):function(e){var t=e.message,n=(e.updateMessage,e.listening),a=e.stopListening,s=e.startSession,i=e.transcript;e.sendProps;return r.a.createElement("div",{className:"app-container"},r.a.createElement("h2",{className:"greeting"},t),r.a.createElement("div",{className:"voice-icon-wrapper",onClick:function(){n?a():s()}},r.a.createElement("img",{className:"voice-icon",src:"https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif",alt:""})),r.a.createElement("p",{className:"transcript"},r.a.createElement("em",null,i)),r.a.createElement("p",{className:"credit"},"animation design by ",r.a.createElement("a",{href:"https://dribbble.com/glebich",target:"_blank"},"Gleb Kuznetsov")),r.a.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400&display=swap",rel:"stylesheet"}))}(Object(c.a)(Object(c.a)({},A),{},{sendProps:D}))}var O=function(e){var t=e.transcript,n=e.resetTranscript,a=e.setMessage,r=e.setIntent,s=e.updateState,i=e.onAudioFinish,c=function(){var e=localStorage.getItem("api_key");return e||(e=prompt("Enter device api key"))&&e.length>5&&localStorage.setItem("api_key",e),e}(),o="https://www.ultron.sh/server";try{fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({transcript:t,api_key:c,generateAudio:!0})}).then((function(e){if(200===e.status)return e.json();throw a("Error in request"),s("Error"),Error("Request rejected")})).then((function(e){var t=e.intent,l=e.message;e.code;"Invalid credentials"===l&&(c=prompt("Enter device api key"))&&c.length>5&&localStorage.setItem("api_key",c),r(t),a(l),s("response"),function(e){var t=e.data,n=e.updateState,a=e.resetTranscript,r=t.message,s=t.intent;a(),"launch"===s?window.open(t.url):"hardwareSleepIntent"===s||"closeShopIntent"===s?n("sleep"):"pullLatestVersion"===s?t.update&&setTimeout((function(){return window.location.reload()}),6e3):"clearIntent"==s&&n("ambient")}({data:e,updateState:s,resetTranscript:n});var u=new Audio(o+"/audioFile?fileName="+e.fileName);u.play(),u.addEventListener("ended",(function(e){return i(e)}))})).catch((function(e){console.error(e),s("error"),a(e.message)}))}catch(l){alert()}};function y(){return r.a.createElement(S.a,null,r.a.createElement(w.c,null,r.a.createElement(w.a,{path:"/chat"},r.a.createElement(E,null)),r.a.createElement(w.a,{path:"/"},r.a.createElement(j,null))))}setInterval(y,1e3);var N=y;Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(N,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[25,1,2]]]);
//# sourceMappingURL=main.11c83686.chunk.js.map