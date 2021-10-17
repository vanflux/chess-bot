export function cheatDetectionPluginHook(str: string) {
  let matches = str.match(/(\w+\.createCheatDetectionPlugin)/);
  if (matches) {
    let [toReplace] = matches;
    str = str.replaceAll(
      toReplace,
      (()=>({
        api: () => ({didChangePieces: false, didUseCheatMouse: false, moveHoldTimes: []}),
        match: new Array(3).fill(null).map(x => ({ condition: ()=>false, handler: ()=>{} }) ),
        name: "cheatDetection",
      })).toString().replace(/[\n\r]/g, ''),
    );
  }
  return str;
}