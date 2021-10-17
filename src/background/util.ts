export const detourAll = (varName) => 
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
    //@ts-ignore
    detourObjectFunctions(obj);
    console.log('[DetourAll ' + obj + '] success');
  }).toString() + ')(' + varName + ')})()';