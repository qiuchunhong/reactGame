import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }
  render() {
    return (
      <div>
        {
          Array(3).fill(null).map((xVal, x) => (
            <div className="board-row" key={x}>
              {
                Array(3).fill(null).map((yVal, y) => (
                  this.renderSquare(3 * x + y)
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O"
    this.setState({
      history: history.concat([{
        squares: squares,
        lastIndex: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }
  jumpTo(step) {
    let liList = document.getElementsByClassName('game-info')[0].getElementsByTagName("li");
    for (var i = 0; i < liList.length; i++) {
      liList[i].childNodes[0].style = ''
    }
    liList[step].childNodes[0].style = 'background:yellow'
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const xAxis = ['a', 'b', 'c'];
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + (parseInt(step.lastIndex / 3) + 1) + ',' + xAxis[step.lastIndex % 3] + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    let status;
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      if (this.state.stepNumber === 9) {
        status = 'The match was drawn'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }
    return (
      <div className="game">
        <div className="game-x-axis">
          <div className="x-axis"></div>
          <div className="x-axis">1</div>
          <div className="x-axis">2</div>
          <div className="x-axis">3</div>
        </div>
        <div className="game-board">
          <div className="x-axis">a</div>
          <div className="x-axis">b</div>
          <div className="x-axis">c</div>
          <Board squares={current.squares} onClick={(i) => { this.handleClick(i) }} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}