import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/App";

const masawadaImages = [
  'masawada-without-tea.png',
  'masawada-smaphone.png',
  'masawada-smart.png',
  'masawada-water.png',
  'masawada-icon.jpeg'
];

if (navigator.serviceWorker) {
  ReactDOM.render(
    <App masawadaImages={masawadaImages} />,
    document.querySelector('main')
  );
  (async () => {
    await navigator.serviceWorker.register('/sw.js');
    try {
      const res = await fetch('/static/update.json');
      const json: {lastUpdate: string} = await res.json();
      const lastUpdate = localStorage.getItem('lastUpdate');
      if (lastUpdate && lastUpdate === json.lastUpdate) return;
      console.log('updateCache');
      localStorage.setItem('lastUpdate', json.lastUpdate);
      await caches.delete('ourCache');
    } catch (e) {console.error(e);}
    const c = await caches.open('ourCache');
    c.addAll([
      ...masawadaImages.map(a => '/static/images/' + a),
      '/',
      '/dist/bundle.js'
    ])
  })()
} else {
  alert('モダンなブラウザで実行してください')
}

