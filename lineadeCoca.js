class LineaDCoca extends Agent {

    constructor() {
        super();
        this.boardManager = new Board();
    }

    init(color, board, time = 20000) {
        this.color = color
        this.noColor = color == "W" ? "B" : "W";
        this.time = time
        this.size = board.length
        this.boardMatrix = board;
        this.k = parseInt(Konekti.vc('k').value); // k-pieces in row
    }

    compute(board, time) {
        let index = 0;
        var moves = this.boardManager.valid_moves(board)
        const iChoto = this.choto(board,moves);
        if (iChoto) {
            index = iChoto;
        }
        return moves[index]
    }

    //da las posibilidades que tiene colorminmax para juntar fichas
    evaluate(board, k, colorminmax){
        var size = board.length
        for( var i=0; i<size; i++){
            for(var j=0; j<size; j++){
                var p = board[i][j]
                if(p!=' '){
                    let c1 = 0;
                    let c2 = 0;
                    let c3 = 0;
                    let c4 = 0;
                    if(j+k<=size && i+k<=size){                        
                        c1 = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j+h]==colorminmax) c1++
                        if(c1==k) return Infinity
                    }
                    if(j+1>=k && i+k<=size){                        
                        c2 = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j-h]==colorminmax) c2++
                        if(c2==k) return Infinity

                    }
                    if(j+k<=size){                        
                        c3 = 1
                        for(var h=1;h<k; h++)
                            if(board[i][j+h]==colorminmax) c3++
                        if(c3==k) return Infinity

                    }
                    if(i+k<=size){
                        c4 = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j]==colorminmax) c4++
                            else break;
                        if(c4==k) return Infinity
                    }
                    return c1+c2+c3+c4
                }
            }
        }      
        return ' '
    }

    choto(boardMyMove,moves){
        for (let i = 0; i < moves.length; i++) {
            const element = moves[i];
            const clonTablero = this.boardManager.clone(boardMyMove);
            this.boardManager.move(clonTablero,moves[i],this.noColor);
            if (this.winner(clonTablero,this.noColor) != " ") {
                return i
            }else{
                return false
            }
            
        }
        return false;
    }

}