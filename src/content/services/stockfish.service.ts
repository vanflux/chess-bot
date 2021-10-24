
class Stockfish {
  static _worker;

  static get worker() {
    if (!Stockfish._worker) {
      let worker = new Worker(wrappedJSObject.Config.threadedEnginePaths.stockfish.asm);
      worker.postMessage('uci');
      Stockfish._worker = worker;
    }
    return Stockfish._worker;
  }

  static postMessage(message) {
    Stockfish.worker.postMessage(message);
  }

  static addEventListener(eventName, listener) {
    Stockfish.worker.addEventListener(eventName, listener);
  }
  
  static removeEventListener(eventName, listener) {
    Stockfish.worker.removeEventListener(eventName, listener);
  }
}

export default Stockfish;
