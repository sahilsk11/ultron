(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{14:function(e,t,n){},21:function(e,t,n){},22:function(e,t,n){},23:function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),r=n(8),i=n.n(r),c=(n(14),n(1)),o=n.n(c),l=n(4),u=n(2),p=n(3),m=n.n(p);function f(e){var t=e.data,n=(e.setMessage,t.message),a=t.intent;return"unknown"===t.intent&&(n="I don't quite understand"),"launch"===t.intent&&window.open(t.url),{message:n,intent:a}}n(21),n(22);function g(e){var t,n=e.message,a=e.transcript,r=e.startSession,i=e.closeSession,c=e.state,o=e.intentResponse,l=e.updateState,u=s.a.createElement("img",{className:"pi-ambient",onClick:function(){return r()},src:"pi-ambient.gif",alt:""}),p=d({closeSession:i,greeting:"listening...",state:c,transcript:a}),m=d({closeSession:i,greeting:"thinking...",state:c}),f=function(e){var t=e.intentResponse,n=e.message,a=e.updateState;return s.a.createElement("div",{className:"pi-active-container",onClick:function(){return a("ambient")}},s.a.createElement("h1",{className:"pi-greeting"},s.a.createElement("em",null,t)),s.a.createElement("div",{className:"pi-transcript-wrapper"},s.a.createElement("p",{className:"pi-transcript"},s.a.createElement("em",null,n))))}({intentResponse:o,message:n,updateState:l});return t="ambient"===c?u:"listening"===c?p:"processing"===c?m:f,s.a.createElement("div",{className:"pi-wrapper"},t,s.a.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap",rel:"stylesheet"}))}function d(e){var t=e.closeSession,n=e.greeting,a=e.state,r=e.transcript,i="listening"===a?s.a.createElement("img",{src:"./pi-listening.gif",className:"pi-listening",alt:""}):s.a.createElement("div",{class:"spinner"},s.a.createElement("div",{class:"bounce1"}),s.a.createElement("div",{class:"bounce2"}),s.a.createElement("div",{class:"bounce3"}));return s.a.createElement("div",{onClick:function(){return t()},className:"pi-active-container"},s.a.createElement("h1",{className:"pi-greeting"},s.a.createElement("em",null,n)),s.a.createElement("div",{className:"pi-transcript-wrapper"},s.a.createElement("p",{className:"pi-transcript"},s.a.createElement("em",null,r))),i)}var v=function(){var e=Object(l.a)(o.a.mark((function e(t){var n,a,s,r,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.transcript,a=t.setMessage,s=t.setIntent,!1,r="https://api.sahilkapur.com","/setIntent",i="?transcript="+n.toLowerCase(),fetch(r+"/setIntent"+i).then((function(e){return e.json()})).then(function(){var e=Object(l.a)(o.a.mark((function e(t){var n,i,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=f({data:t,setMessage:a}),i=n.intent,c=n.message,s(i),a(c),new Audio(r+"/audioFile?fileName="+t.fileName).play();case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();var h=function(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],r=t[1],i=Object(p.useSpeechRecognition)(),c=i.listening,f=i.transcript,d=i.resetTranscript,h=Object(a.useState)("ambient"),b=Object(u.a)(h,2),w=b[0],E=b[1],S=Object(a.useState)("Hello, Sahil."),j=Object(u.a)(S,2),O=j[0],N=j[1],k=Object(a.useState)(null),y=Object(u.a)(k,2),R=y[0],I=y[1],C=Object(a.useState)(!1),L=Object(u.a)(C,2),M=L[0];L[1],Object(a.useEffect)((function(){m.a.browserSupportsSpeechRecognition()||alert("Unsupported Browser")}),[]);var x=function(){N("Go ahead..."),r(new Date),E("listening"),m.a.startListening({continuous:!0})},_=Object(a.useRef)(w);_.current=w;var B=function(){var e=Object(l.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return N("processing..."),E("processing"),e.next=4,v({transcript:f,setMessage:N,setIntent:I});case 4:d(),E("response"),console.log(w),setTimeout((function(){"response"===_.current&&D()}),2e4);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),D=function(){N("Hello, Sahil."),E("ambient")};Object(a.useEffect)((function(){return r(new Date)}),[f]),"ambient"!==w||c||M||m.a.startListening({continuous:!0}),"listening"!==w&&(f.toLowerCase().includes("ultron")?(d(),x()):c&&"response"===w&&f.toLowerCase().includes("clear")&&(d(),D())),function(e,t){var n=Object(a.useRef)();Object(a.useEffect)((function(){n.current=e}),[e]),Object(a.useEffect)((function(){if(null!==t){var e=setInterval((function(){n.current()}),t);return function(){return clearInterval(e)}}}),[t])}((function(){""!==f&&"listening"===w&&((new Date-n)/1e3>2&&B())}),""!==f&&"listening"===w?1e3:null);var H={message:O,intentResponse:R,transcript:"listening"===w?f:"",startSession:x,closeSession:D,state:w,updateState:E},J=window.location.search;return"pi"===new URLSearchParams(J).get("device")?g(H):function(e){var t=e.message,n=e.listening,a=e.stopListening,r=e.startSession,i=e.transcript;return s.a.createElement("div",{className:"app-container"},s.a.createElement("h2",{className:"greeting"},t),s.a.createElement("div",{className:"voice-icon-wrapper",onClick:function(){n?a():r({continuous:!0})}},s.a.createElement("img",{className:"voice-icon",src:"https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif",alt:""})),s.a.createElement("p",{className:"transcript"},s.a.createElement("em",null,i)),s.a.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap",rel:"stylesheet"}))}(H)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(h,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t,n){e.exports=n(23)}},[[9,1,2]]]);
//# sourceMappingURL=main.f99ad28a.chunk.js.map