import { cheatDetectionPluginHook } from "./hooks/cheatDetectionPluginHook";
import { gameHook } from "./hooks/gameHook";

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();
    let str = '';
  
    filter.ondata = event => {
      str += decoder.decode(event.data, {stream: true});
    }

    filter.onstop = event => {
      for (let injection of injections) str = injection(details, str);
      filter.write(encoder.encode(str));
      filter.disconnect();
    }
  },
  {
    urls: [
      "*://www.chess.com/bundles/app/js/*.js",
      "*://betacssjs.chesscomfiles.com/bundles/app/js/*.js"
    ]
  },
  [
    "blocking"
  ],
);

const injections = [
  // Game injection
  ({url}, str) => {
    if (!url.includes('play__beta')) return str;

    // Game instance hook
    console.log('Hooking GameInstance...');
    str = gameHook(str);

    // Bypass cheat detection plugin
    console.log('Hooking CheatDetectionPlugin...');
    str = cheatDetectionPluginHook(str);
    
    return str;
  },
];
