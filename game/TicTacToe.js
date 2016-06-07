function TicTacToe(room){
  this.room = room;
  this.table = new Array(9);
  this.players = ["",""];
  this.turn = 0;
  this.symbol = ['O','X'];
}

TicTacToe.prototype.setPlayer = function(player){
    if(this.players[0] != ""){
      this.players[1] = player;
    }
    else {
      this.players[0] = player;
    }
}


// Check if current move belongs to current player
// return boolean
TicTacToe.prototype.isTurn = function(player){
  return this.players[this.turn] == player;
};

// Check if position on the table is empty
// return boolean
TicTacToe.prototype.positionIsEmpty = function(position){
  return table['position'] != 'O' && table['position'] != 'X';
};

// Place a mark on the table
TicTacToe.prototype.makeMove = function(position){
  if(this.positionIsEmpty(position)){
      this.table[position] = this.symbol[this.turn];
  }
}

// Change players turn
TicTacToe.prototype.nextPlayer = function(){
  this.turn = !this.turn;
}

// return the winner
TicTacToe.prototype.getWinner = function(num){
  return this.players[this.symbol.indexOf(this.table[num])];
}

// checks for winner
TicTacToe.prototype.checkForWinner = function(){
  if(this.table[0] == this.table[1] == this.table[2] ||
     this.table[0] == this.table[3] == this.table[6] ||
     this.table[4] == this.table[0] == this.table[8])
      return this.getWinner(0);
  else if(this.table[3] == this.table[4] == this.table[5] ||
          this.table[1] == this.table[4] == this.table[7] ||
          this.table[4] == this.table[2] == this.table[6])
      return this.getWinner(4);
  else if(this.table[6] == this.table[7] == this.table[8] ||
          this.table[2] == this.table[5] == this.table[8])
      return this.getWinner(8);
  else
      return false;
}
