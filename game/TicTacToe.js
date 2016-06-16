function TicTacToe(room){
  this.room = room;
  this.table = new Array(9);
  this.players = new Array(2);
  this.turn = 0;
  this.symbol = ['O','X'];
}

// return the board
TicTacToe.prototype.printBoard = function(){
  return this.table;
}

// Sets the players
TicTacToe.prototype.setPlayer = function(player1,player2){
    this.players = [player1,player2];
}

// Check if current move belongs to current player
// return boolean
TicTacToe.prototype.isTurn = function(player){
  return this.players[this.turn] == player;
};

// Check if position on the table is empty
// return boolean
TicTacToe.prototype.positionIsEmpty = function(position){
  return this.table[position] == undefined;
};

// Change players turn
TicTacToe.prototype.nextPlayer = function(){
  this.turn = this.turn == 0 ? 1 : 0;
}

// Place a mark on the table
TicTacToe.prototype.makeMove = function(position){
  if(this.positionIsEmpty(position)){
      this.table[position] = this.symbol[this.turn];
      this.nextPlayer();
      return true;
  }
  else
    return false;
}

// return the winner
TicTacToe.prototype.getWinner = function(num){
  return this.players[this.symbol.indexOf(this.table[num])];
}

// checks for winner
TicTacToe.prototype.checkForWinner = function(){
  if(this.table[0]==this.table[1] && this.table[0]==this.table[2] && this.table[0] != undefined ||
     this.table[0]==this.table[3] && this.table[0]==this.table[6] && this.table[0] != undefined ||
     this.table[0]==this.table[4] && this.table[0]==this.table[8] && this.table[0] != undefined)
       return this.getWinner(0);
  else if(this.table[4]==this.table[3] && this.table[4]==this.table[5] && this.table[4] != undefined ||
          this.table[4]==this.table[1] && this.table[4]==this.table[7] && this.table[4] != undefined ||
          this.table[4]==this.table[2] && this.table[4]==this.table[6] && this.table[4] != undefined )
            return this.getWinner(4);
  else if(this.table[8]==this.table[6] && this.table[8]==this.table[7] && this.table[8] != undefined ||
          this.table[8]==this.table[2] && this.table[8]==this.table[5] && this.table[8] != undefined )
              return this.getWinner(8);
  else
      return false;
}

module.exports = TicTacToe;
