(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{14:function(e,t,n){},21:function(e,t,n){},22:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(7),c=n.n(s),i=(n(14),n(2)),o=n.n(i),u=n(8),l=n(4),f=n(1),p=n.n(f);function g(e){var t=e.data,n=e.setMessage;"unknown"===t.intent&&n("I don't quite understand."),200===t.code&&"launch"===t.intent?(window.open(t.url),n("Launching "+t.app+"...")):n(t.message)}n(21);var h=function(){var e=Object(u.a)(o.a.mark((function e(t){var n,a,r,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.transcript,t.startListening,a=t.resetTranscript,r=t.setMessage,!1,"https://api.sahilkapur.com/setIntent",s="?transcript="+n.toLowerCase(),fetch("https://api.sahilkapur.com/setIntent"+s).then((function(e){return e.json()})).then((function(e){g({data:e,setMessage:r})})),setTimeout((function(){a()}),1e3);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();var m=function(){var e=Object(a.useState)("Hello, Sahil."),t=Object(l.a)(e,2),n=t[0],s=t[1],c=Object(a.useState)(null),i=Object(l.a)(c,2),o=i[0],u=i[1],g=Object(f.useSpeechRecognition)(),m=g.listening,d=g.transcript,v=g.resetTranscript;return Object(a.useEffect)((function(){m?(s("Go ahead..."),u(new Date)):s("Hello, Sahil."),m||""===d||h({transcript:d,startListening:p.a.startListening,resetTranscript:v,setMessage:s})}),[m]),Object(a.useEffect)((function(){return u(new Date)}),[d]),function(e,t){var n=Object(a.useRef)();Object(a.useEffect)((function(){n.current=e}),[e]),Object(a.useEffect)((function(){if(null!==t){var e=setInterval((function(){n.current()}),t);return function(){return clearInterval(e)}}}),[t])}((function(){""!==d&&m&&((new Date-o)/1e3>2&&(s("processing..."),v(),h({transcript:d,startListening:p.a.startListening,resetTranscript:v,setMessage:s})))}),""!==d?1e3:null),r.a.createElement("div",null,r.a.createElement("h2",{className:"greeting"},n),r.a.createElement("img",{className:"voice-icon",onClick:function(){return m?p.a.stopListening():p.a.startListening({continuous:!0})},src:"https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif"}),r.a.createElement("div",{className:"listening"}),r.a.createElement("p",{className:"transcript"},r.a.createElement("em",null,d)),r.a.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap",rel:"stylesheet"}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(m,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t,n){e.exports=n(22)}},[[9,1,2]]]);
//# sourceMappingURL=main.d48eea8c.chunk.js.map