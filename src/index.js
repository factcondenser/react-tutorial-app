import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

// class Board extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       squares: Array(9).fill(null),
//       xIsNext: true,
//     };
//   }
//
//   handleClick(i) {
//     const squares = this.state.squares.slice();
//     if (calculateWinner(squares) || squares[i]) {
//       return;
//     }
//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//     this.setState({
//       squares: squares,
//       xIsNext: !this.state.xIsNext,
//     });
//   }
//
//   renderSquare(i) {
//     return (
//       <Square
//         value={this.state.squares[i]}
//         onClick={() => this.handleClick(i)}
//       />
//     );
//   }
//
//   render() {
//     const winner = calculateWinner(this.state.squares);
//     let status = winner ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//
//     return (
//       <div>
//         <div className="status">{status}</div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

class Board extends React.Component {
  renderSquare(i, style) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={style}
        key={i}
      />
    );
  }

  render() {
    let i = 0;

    // using for loops
    // let board = [];
    // for (let r = 0; r < 3; r++) {
    //   let row = [];
    //   for (let c = 0; c < 3; c++) {
    //     row.push(this.renderSquare(i++));
    //   }
    //   board.push(<div className="board-row" key={r}>{row}</div>)
    // }

    // using rendering of arrays
    const winningSquares = this.props.winningSquares;
    const board = this.props.squares.slice(0, 3).map((key, idx) => {
      // using ( instead of { right away is shorthand for 'return this'
      const row = this.props.squares.slice(0, 3).map((key, idx) => {
        let style = winningSquares.includes(i) ? { background: '#ff0' } : null;
        return (
          this.renderSquare(i++, style)
        );
      });
      return (
        <div className="board-row" key={idx}>{row}</div>
      );
    });

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveCoords: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      moveSortAsc: true,
    };
  }

  //**--- Click Handlers ---**//
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWin(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const moveCoords = calculateMoveCoords(i);

    this.setState({
      history: history.concat([{
        squares: squares,
        moveCoords: moveCoords,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    });
  }

  toggleSortDir() {
    this.setState({
      moveSortAsc: !this.state.moveSortAsc,
    });
  }

  //**--- Render Helpers ---**//
  renderMoveDesc(move) {
    const description = move ?
      move === this.state.stepNumber ?
      <b>{'Go to move #' + move}</b> :
      'Go to move #' + move :
      'Go to game start';
    return description;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWin(current.squares);
    const winner = win ? win.winner : null;
    const winningSquares = win ? win.winningSquares : [];
    const moves = history.map((step, move) => {
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{this.renderMoveDesc(move)} {step.moveCoords}</button>
        </li>
      );
    });

    let status = win ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    let sortButtonText = this.state.moveSortAsc ? 'Sort descending' : 'Sort ascending';
    if (!this.state.moveSortAsc) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.toggleSortDir()}>{sortButtonText}</button>
          </div>
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

function calculateWin(squares) {
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
      // this.highlightSquares();
      return { winner: squares[a], winningSquares: lines[i] };
    }
  }
  return null;
}

function calculateMoveCoords(i) {
  const row = ((idx) => {
    switch(true) {
      case idx < 3:
        return 1;
      case idx < 6:
        return 2;
      default:
        return 3;
    }
  })(i);
  const col = (i % 3) + 1;
  return '(' + row + ', ' + col + ')';
}
