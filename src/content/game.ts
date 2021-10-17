
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
  
}

export default Game;
