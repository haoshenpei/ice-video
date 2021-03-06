import React, { Component, PropTypes } from 'react';
import DanmukuCanvas from '../util/Canvas';

export default class Danmuku extends Component {
  static displayName = 'IcePlayerDanmuku';

  static propTypes = {
    danmuku: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.string,
      date: PropTypes.string,
      timePoint: PropTypes.number,
    })),
    playerAction: PropTypes.number,
    currentTime: PropTypes.number,
    loading: PropTypes.bool,
    duration: PropTypes.number,
  }

  componentDidMount() {
    this.dc = new DanmukuCanvas(this.canvas, this.props.duration);
    this.dc.draw();
    window.addEventListener('resize', this.onWindowResize);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.currentTime !== this.props.currentTime) {
      this.runDanmuku();
      return true;
    }
    if (nextProps.playerAction !== this.props.playerAction) {
      if (nextProps.playerAction === 1) {
        this.drawDanmuku();
      } else if (nextProps.playerAction === 2) {
        this.stopDanmuku();
      }
      return true;
    }
    return false;
  }

  // componentDidUpdate() {
  //   const { danmuku, playerAction, currentTime, loading } = this.props;
  //   if (playerAction === 1 && !loading) {
  //     const data =
  //       danmuku.filter(d => (d.timePoint >= currentTime && d.timePoint < currentTime + 0.5));
  //     this.dc.addDanmuku(data);
  //     this.dc.draw();
  //   } else if (playerAction === 2 || loading) {
  //     this.dc.stop();
  //   }
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    this.dc.stop();
  }

  onWindowResize = () => {
    this.dc.resize(this.canvas);
  }

  insertDanmuku = (danmu) => {
    this.dc.insertDanmuku(danmu);
  }

  runDanmuku = () => {
    const { danmuku, playerAction, currentTime, loading } = this.props;
    if (playerAction === 1 && !loading) {
      const data =
        danmuku.filter(d => (Math.round(d.timePoint) === Math.round(currentTime)));
      this.dc.addDanmuku(data);
      this.dc.draw();
    }
  }

  drawDanmuku = () => {
    const { playerAction, loading } = this.props;
    if (playerAction === 1 && !loading) {
      this.dc.draw();
    }
  }

  stopDanmuku = () => {
    this.dc.stop();
  }

  render() {
    return (
      <canvas
        className="player-danmuku"
        ref={node => (this.canvas = node)}
      />
    );
  }
}
