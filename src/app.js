
class App {
  constructor() {
    this.putIcon();
    this.cheat();
  }

  async cheat() {
    Game.onAll(({data, type}) => {
      //console.log(type, data);
      if (type === 'UpdateECO') {
        let fen = Game.getFEN();
        Stockfish.postMessage('position fen ' + fen);
        Stockfish.postMessage('go movetime ' + Config.stockfish.calculationTime); // Request best move to stockfish worker
        let handler = (message) => {
          if (message.data.startsWith('bestmove')) {
            Stockfish.removeEventListener('message', handler);
            let move = message.data.substring(9);
            let from = move.substring(0, 2);
            let to = move.substring(2, 4);
            console.log('bestmove', from, to);
            Game.clearMarkings();
            Game.toggleMarking(Config.highlightColor, from);
            Game.toggleMarking(Config.highlightColor, to);
          }
        }
        Stockfish.addEventListener('message', handler);
      }
    });
  }

  putIcon() {
    let icon = document.createElement('img');
    icon.src = browser.runtime.getURL('icons/icon-48.png');
    icon.style.paddingRight = 10;
    this.insertAsFirstChild(this.getPlayButton(), icon);
  }

  getPlayButton() {
    let aux = document.querySelector('button > div[class*="play"]');
    if (!aux) return null;
    return aux && aux.parentElement;
  }

  insertAsFirstChild(node, toInsert) {
    if (!node) return;
    node.prepend(toInsert)
  }
}

class Config {
  static stockfish = {
    calculationTime: 1000,
  };
  static highlightColor = 'a';
}

class Stockfish {
  static staticConstructor = (()=>{
    wrappedJSObject.onload = exportFunction(() => {
      let instance = new Worker(wrappedJSObject.Config.threadedEnginePaths.stockfish.asm);
      Stockfish.setInstance(instance);
    }, wrappedJSObject);
  })()

  static setInstance(instance) {
    Stockfish.instance = instance;
    Stockfish.postMessage('uci');
  }

  static postMessage(message) {
    Stockfish.instance.postMessage(message);
  }

  static addEventListener(eventName, listener) {
    Stockfish.instance.addEventListener(eventName, listener);
  }
  
  static removeEventListener(eventName, listener) {
    Stockfish.instance.removeEventListener(eventName, listener);
  }
}

class Game {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

new App();