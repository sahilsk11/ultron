(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{12:function(t,n,e){},19:function(t,n,e){"use strict";e.r(n);var o=e(0),r=e.n(o),a=e(6),c=e.n(a),i=(e(12),e(1)),s=e.n(i);var l=function(){var t=Object(i.useSpeechRecognition)(),n=t.listening,e=t.transcript,o=t.resetTranscript,a=n?s.a.stopListening:function(){return s.a.startListening({continuous:!0})};return r.a.createElement("div",null,r.a.createElement("button",{onClick:a},"start"),r.a.createElement("button",{onClick:o},"reset"),r.a.createElement("button",{onClick:function(){var t="?transcript="+e.toLowerCase();fetch("https://api.sahilkapur.com/addDailyWeight"+t).then((function(t){return t.json()})).then((function(t){return alert(t)}))}},"send"),r.a.createElement("p",null,e))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(l,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))},7:function(t,n,e){t.exports=e(19)}},[[7,1,2]]]);
//# sourceMappingURL=main.92bf8378.chunk.js.map