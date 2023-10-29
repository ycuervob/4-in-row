class LineaDCoca extends Agent{
    
    constructor(){ 
        super();
        this.board = new Board();
    }

    init(color, board, time=20000){
        this.color = color
        this.noColor = color == "W" ? "B" : "W";
        this.time = time
        this.size = board.length
    }
    
    compute(board,time){
        console.log(board,"tiempo",time);

        var moves = this.board.valid_moves(board)
        const index = this.minimax(board,moves,true);

        console.log(this.color + ',' + moves[index])
        return moves[index]
    }

    evaluate(board){
        move
    }

    // Función Minimax para encontrar la mejor jugada
    minimax(board,moves, isMaximizingPlayer) {

        let index = 0;

        let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i]) {
                    board.move(board,moves[i],this.color);
                    const score = this.evaluate(board);
                    if (score >= bestScore){
                        index = i;
                        bestScore = score;
                    }
                }
            }
        return index
    }
}