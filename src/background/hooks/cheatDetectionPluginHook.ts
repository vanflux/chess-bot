export function cheatDetectionPluginHook(str: string) {
  let matches = str.match(/(\w+\.createCheatDetectionPlugin)/);
  if (matches) {
    let [toReplace] = matches;
    str = str.replaceAll(
      toReplace,
      (()=>({
        api: () => ({get: () => ({didChangePieces: false, didUseCheatMouse: false, moveHoldTimes: []}) }),
        match: new Array(3).fill(null).map(x => ({ condition: ()=>false, handler: ()=>{} }) ),
        name: "cheatDetection",
      })).toString().replace(/[\n\r]/g, ''),
    );
  }

  // Miserably try to hook move function...
  //str = str.replaceAll('makeMove=(e,t,s=!1)=>{', 'makeMove=(e,t,s=!1)=>{console.log("makeMove(",e,",",t,",",s,")");');
  
  return str;
}