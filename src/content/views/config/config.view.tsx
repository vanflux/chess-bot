import React, { ChangeEvent } from "react";
import Config from "../../config";
import styles from './styles.module.css';

interface ConfigViewProps {
  onRecalculate: ()=>void;
  onThinkingTime: (value: number)=>void;
  onHighlightColor: (value: string)=>void;
}
 
interface ConfigViewState {
  thinkingTime: number,
  highlightColor: string,
}
 
class ConfigView extends React.Component<ConfigViewProps, ConfigViewState> {
  constructor(props: ConfigViewProps) {
    super(props);
    this.state = {
      thinkingTime: 1000,
      highlightColor: 'a',
    };
  }

  onThinkingTimeChanged(e: ChangeEvent<HTMLInputElement>) {
    let thinkingTime = parseInt(e.target.value);
    this.setState({thinkingTime});
    this.props.onThinkingTime(thinkingTime);
  }
  
  onHighlightColorChanged(e: ChangeEvent<HTMLSelectElement>) {
    let highlightColor = e.target.value
    this.setState({highlightColor});
    this.props.onHighlightColor(highlightColor);
  }
  
  onRecalculateRequest() {
    this.props.onRecalculate();
  }
  
  render() {
    return (
      <div className={styles.container}>
        <h3>Chess-Bot</h3>
        <label htmlFor="thinking-time">Thinking Time:</label>
        <input name="thinking-time" className={styles.spacing} onChange={this.onThinkingTimeChanged.bind(this)} type="number" value={this.state.thinkingTime}></input>
        
        <label htmlFor="highlight-color">Highlight Color:</label>
        <select name="highlight-color" className={styles.spacing} onChange={this.onHighlightColorChanged.bind(this)} value={this.state.highlightColor}>
          <option value="a">Blue</option>
          <option value="b">Yellow</option>
          <option value="d">Red</option>
        </select>
        <button className={styles.button} onClick={this.onRecalculateRequest.bind(this)}>Re-Calculate</button>
      </div>
    );
  }
}
 
export default ConfigView;