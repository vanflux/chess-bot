export function gameHook(str: string) {
  return str.replaceAll(
    'this.game=Object',
    'let v,name="___"+Math.floor(Math.random()*1000000000)+"___";' +
    'Object.defineProperty(window.confirm,name,{' +
      'get:()=>v,' +
      'set:(value)=>{v=value;window.newGameInstance=name},' +
    '});' +
    'this.game=window.confirm[name]=Object'
  );
}