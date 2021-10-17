import Config from "./config";
import Game from "./game";
import Stockfish from "./stockfish";

class App {
  constructor() {
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
            //console.log('bestmove', from, to);
            Game.clearMarkings();
            Game.toggleMarking(Config.highlightColor, from);
            Game.toggleMarking(Config.highlightColor, to);
          }
        }
        Stockfish.addEventListener('message', handler);
      }
    });
  }
}

new App();