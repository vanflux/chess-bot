import React from 'react';
import Draggable from 'react-draggable';
import BestMoveHack from "./hacks/bestMove.hack";
import Config from './config';
import ConfigView from './views/config/config.view';

interface AppProps {
  
}
 
interface AppState {
  
}
 
class App extends React.Component<AppProps, AppState> {
  private bestMoveHack: BestMoveHack;

  constructor(props: AppProps) {
    super(props);
    this.state = {};
    
    this.bestMoveHack = new BestMoveHack();
    this.bestMoveHack.start();
    //bestMoveHack.stop();
  }

  private onHighlightColor(value: string) {
    Config.highlightColor = value;
  }

  private onThinkingTime(value: number) {
    Config.thinkingTime = value;
  }

  private onRecalculate() {
    this.bestMoveHack.recalculate();
  }

  render() { 
    return (
      <div>
        <Draggable>
          <div style={{position: 'fixed', pointerEvents: 'all'}}>
            <ConfigView 
              onHighlightColor={this.onHighlightColor.bind(this)}
              onThinkingTime={this.onThinkingTime.bind(this)}
              onRecalculate={this.onRecalculate.bind(this)}>
            </ConfigView>
          </div>
        </Draggable>
      </div>
    );
  }
}

export default App;