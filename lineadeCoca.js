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
    }

    compute(board, time) {
        console.log(board, "tiempo", time);

        var moves = this.boardManager.valid_moves(board)
        const index = this.pasoMinimax(board, moves, true);

        console.log(this.color + ',' + moves[index])
        return moves[index]
    }

    evaluate(board,isMaximizingPlayer) {
        let boardScore = 0;



        return boardScore
    }

    //Solo hace un paso del minimax
    pasoMinimax(board, moves, isMaximizingPlayer) {

        let index = 0;
        let colorminmax = isMaximizingPlayer ? this.color : this.noColor;
        let bestScore = isMaximizingPlayer ? -Infinity : +Infinity;
        let minmaxEq = (isMaximizingPlayer, score, bestScore) => {
            return isMaximizingPlayer ? score >= bestScore : score <= bestScore;
        }

        for (let i = 0; i < moves.length; i++) {
            if (moves[i]) {
                const cloneForPasoMinMax = this.boardManager.clone(board);
                this.boardManager.move(cloneForPasoMinMax, moves[i], colorminmax);
                const score = this.evaluate(cloneForPasoMinMax, isMaximizingPlayer);
                if (minmaxEq(isMaximizingPlayer, score, bestScore)) {
                    index = i;
                    bestScore = score;
                }
            }
        }
        return index
    }
}