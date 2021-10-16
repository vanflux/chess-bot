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

let detourAll = (varName) => 
  '(()=>{' + (
    // Dependencies...
    function detourObjectFunctions(obj, name) {
      for (let key in obj) {
        let func = obj[key];
        if (typeof func !== 'function') continue;
        let detour = (...args) => {
          let res,error = false;
          try {
            res = func(...args);
          } catch (exc) {
            res = exc;
            error = true;
          }
          console.log('[DetourAll + ' + name + '] ', obj, key, 'called', args, 'returning:', res, 'isError:', error);
          if (error) throw res;
          return res;
        }
        obj[key]=detour;
      }
    }
  ).toString() + ';(' + 
  
  // Do detours
  ((obj) => {
    console.log('[DetourAll ' + obj + '] applying detour...');
    detourObjectFunctions(obj);
    console.log('[DetourAll ' + obj + '] success');
  }).toString() + ')(' + varName + ')})()';

const injections = [
  // Game injection
  ({url}, str) => {
    if (!url.includes('play__beta')) return str;
    let matches;

    // Game instance hook
    console.log('Hooking GameInstance...');
    str = str.replaceAll(
      'this.game=Object',
      'let v,name="___"+Math.floor(Math.random()*1000000000)+"___";' +
      'Object.defineProperty(window.confirm,name,{' +
        'get:()=>v,' +
        'set:(value)=>{v=value;window.newGameInstance=name},' +
      '});' +
      'this.game=window.confirm[name]=Object'
    );
    
    str = str.replaceAll(
      'var ye=s',
      'var ye=window.____ye____=s'
    );

    // Bypass cheat detection plugin
    matches = str.match(/(\w+\.createCheatDetectionPlugin)/);
    if (matches) {
      let [toReplace] = matches;
      str = str.replaceAll(
        toReplace,
        (()=>({
          api: () => ({didChangePieces: false, didUseCheatMouse: false, moveHoldTimes: []}),
          match: new Array(3).fill().map(x => ({ condition: ()=>false, handler: ()=>{} }) ),
          name: "cheatDetection",
        })).toString().replaceAll(/[\n\r]/g, ''),
      );
    }

    /*matches = str.match(/(\w+)\.on\((\w+)\.Open\,this\.onGameOpen\)/);
    if (matches) {
      let globalEventManagerVarName = matches[1];
      let globalEventManagerEnumVarName = matches[2];

      // GlobalEventManager hook
      console.log('Hooking GlobalEventManager... emeName=' + globalEventManagerVarName + ', emeeName=' + globalEventManagerEnumVarName);
      str = str.replaceAll(
        `const ${globalEventManagerVarName}=`,
        `const ${globalEventManagerVarName}=window.____eme____=`
      );
      
      // GlobalEventManagerEnum hook
      console.log('Hooking GlobalEventManagerEnum... emeName=' + globalEventManagerVarName + ', emeeName=' + globalEventManagerEnumVarName);
      str = str.replaceAll(
        `${globalEventManagerEnumVarName}=`,
        `${globalEventManagerEnumVarName}=window.____emee____=`
      );
    }*/
    
    return str;
  },
];
