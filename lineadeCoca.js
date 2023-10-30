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
        var moves = this.boardManager.valid_moves(board)
        const index = this.minimax(board, moves, true);

        console.log(this.color + ',' + moves[index])
        return moves[index]
    }

    conflictos(board, isMaximizingPlayer) {
        if (tablero[i] == tablero[j] || Math.abs(tablero[i] - tablero[j]) == Math.abs(i - j)) {
            c++;
        }
    }

    evaluate(board, isMaximizingPlayer) {
        let n = board.length;
        let colorminmax = isMaximizingPlayer ? this.color : this.noColor;
        const patronPunto = new RegExp(`[${colorminmax} ]{${this.k},}`, "g")
        let vertical = [];
        let horizontal = [];
        let diagonalI = [];
        let diagonalS = [];

        let conteoVertical = 0;
        let conteoHorizontal = 0;
        let conteoDiagonalI = 0;
        let conteoDiagonalS = 0;


        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                vertical.push(board[i][j]);
                horizontal.push(board[j][i]);

                if (i + j < n) {
                    diagonalI.push(board[i][i + j]);
                    diagonalS.push(board[i + j][i]);
                }

            }

            let verticalStr = vertical.join("");
            let horizontalStr = horizontal.join("");
            let diagonalIStr = diagonalI.join("");
            let diagonalSStr = diagonalS.join("");

            const coincidenciaVer = verticalStr.match(patronPunto);
            const coincidenciaHor = horizontalStr.match(patronPunto);
            const coincidenciaDiagI = diagonalIStr.match(patronPunto);
            const coincidenciaDiagS = diagonalSStr.match(patronPunto);

            if (coincidenciaVer) {
                conteoVertical += coincidenciaVer.filter((char) => char == colorminmax).length;
            }

            if (coincidenciaHor) {
                conteoHorizontal += coincidenciaHor.filter((char) => char == colorminmax).length;
            }

            if (coincidenciaDiagI) {
                conteoDiagonalI += coincidenciaDiagI.filter((char) => char == colorminmax).length;
            }

            if (coincidenciaDiagS) {
                conteoDiagonalS += coincidenciaDiagS.filter((char) => char == colorminmax).length;
            }

            vertical = []; horizontal = []; diagonalI = []; diagonalS = [];
        }

        return (conteoVertical + conteoHorizontal + conteoDiagonalS + conteoDiagonalI);
    }

    minimax(board, moves, isMaximizingPlayer) {

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
                const score = this.evaluate(cloneForPasoMinMax, isMaximizingPlayer, moves);
                if (minmaxEq(isMaximizingPlayer, score, bestScore)) {
                    index = i;
                    bestScore = score;
                }
            }
        }
        return index
    }
}