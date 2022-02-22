import Config from "../config";
import Game from "../hooks/game.hook";
import Stockfish from "../services/stockfish.service";

class BestMoveHack {
  private handler = this.onAllHandler.bind(this);
  private running = false;

  public start() {
    if (this.running) return;
    this.running = true;
    Game.onAll(this.handler);
  }

  public stop() {
    if (!this.running) return;
    this.running = false;
    Game.offAll(this.handler)
  }

  public async recalculate() {
    let fen = Game.getFEN();
    let {from, to} = await this.bestMove(fen);
    Game.clearMarkings();
    Game.toggleMarking(Config.highlightColor, from);
    Game.toggleMarking(Config.highlightColor, to);

    if (Config.autoMove) {
      let options = Game.getOptions();
      const isMyTurn = options.flipped ? (Game.getTurn() == 2) : (Game.getTurn() == 1);
      if (isMyTurn) {
        this.doMove({from, to});
      }
    }
  }

  private async onAllHandler({data, type}) {
    if (type === 'Move') {
      console.log('Move...');
    }
    if (type === 'UpdateECO') {
      this.recalculate();
    }
  }

  private async bestMove(fen: string): Promise<{from: string, to: string}> {
    return new Promise(resolve => {
      Stockfish.postMessage('position fen ' + fen);
      Stockfish.postMessage('go movetime ' + Config.thinkingTime); // Request best move to stockfish worker
      let handler = (message) => {
        if (message.data.startsWith('bestmove')) {
          Stockfish.removeEventListener('message', handler);
          let move = message.data.substring(9);
          let from = move.substring(0, 2);
          let to = move.substring(2, 4);
          resolve({from, to});
        }
      }
      Stockfish.addEventListener('message', handler);
    });
  }

  private async doMove({from, to}) {
    const legalMoves = Game.getLegalMovesForSquare(from);
    if (legalMoves.includes(to)) {
      console.log('Auto-moving...');
      let move = Game.getMove({ from, to });
      Game.move({
        ...move,
        animate: false,
        userGenerated: true,
        userGeneratedDrop: true,
      });
    } else {
      console.log('Illegal move calculated', from, to);
    }
  }
}

export default BestMoveHack;