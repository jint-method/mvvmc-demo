if("serviceWorker"in navigator)navigator.serviceWorker.register(window.location.origin+"/service-worker.js",{scope:"/"}).then(()=>{navigator.serviceWorker.controller.postMessage({type:"cachebust",url:window.location.href})}).catch(e=>{}).then(()=>{const e=new CustomEvent("pjax:init");document.dispatchEvent(e)});else{const e=new CustomEvent("pjax:init");document.dispatchEvent(e)}