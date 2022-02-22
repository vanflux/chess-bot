
class Game {
  static instance;
  static onAllHandlers = [];

  static staticConstructor = (()=>{
    Object.defineProperty(wrappedJSObject, 'newGameInstance', {
      set: exportFunction((name) => {
        let instance = wrappedJSObject.confirm[name];
        Game.setInstance(instance);
      }, wrappedJSObject),
    });

    // This is more chrome manifest v3 compatible... (its large... but is how chrome like...)

    function execOnPage(code) {
      document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'complete') return;
        const script = document.createElement('script');
        script.textContent = code;
        const head = document.getElementsByTagName("head")[0];
        head.insertBefore(script, head.firstChild);
      });
    }
    
    function main() {
      const originalAssign = Object.assign;
      const newAssign = function(...args: Parameters<typeof Object.assign>) {
        for (let arg of args) {
          if (typeof arg === 'object' && arg.getCurrentFullLine !== undefined && arg.getContext !== undefined) {
            const name = '_' + Math.floor(Math.random() * 1000000000);
            window.confirm[name] = arg;
            window['newGameInstance'] = name;
          }
        }
        return originalAssign(...args);
      }
      newAssign.toString = () => 'function assign() {\n    [native code]\n}';
      Object.assign = newAssign;
    }
    
    execOnPage('(' + main.toString() + ')()');
  })();

  static setInstance(instance) {
    Game.instance = instance;
    Game.instance.onAll && Game.instance.onAll(
      exportFunction((...args) => {
        try {
          Game.onAllHandlers.forEach(handler => handler(...args));
        } catch (exc) {
          console.error(exc);
        }
      }, wrappedJSObject)
    );
  }

  static getFEN() {
    return Game.instance.getFEN();
  }

  static toggleMarking(color, square) {
    return Game.instance.toggleMarking(cloneInto({square: {color, square}}, wrappedJSObject), true);
  }

  static clearMarkings() {
    return Game.instance.clearMarkings()
  }

  static onAll(handler) {
    Game.onAllHandlers.push(handler);
  }
  
  static offAll(handler) {
    Game.onAllHandlers = Game.onAllHandlers.filter(x => x != handler);
  }
  
}

export default Game;
