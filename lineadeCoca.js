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
        var alfa = -Infinity;
        var beta = Infinity;
        const index = this.minimax(board, moves, false, 4, alfa, beta)[1];

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
                horizontal.push(board[i][j]);
                vertical.push(board[j][i]);

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
                for (let x = 0; x < coincidenciaVer[0].length; x++) {
                    if(coincidenciaVer[0][x] == colorminmax){
                        conteoHorizontal += 1;
                    }
                }
               
            }
            
            if (coincidenciaHor) {
                for (let x = 0; x < coincidenciaHor[0].length; x++) {
                    if(coincidenciaHor[0][x] == colorminmax){
                        conteoHorizontal += 1;
                    }
                }
            }
            
            if (coincidenciaDiagI) {
                for (let x = 0; x < coincidenciaDiagI[0].length; x++) {
                    if(coincidenciaDiagI[0][x] == colorminmax){
                        conteoDiagonalI += 1;
                    }
                }
            }

            if (coincidenciaDiagS) {
                for (let x = 0; x < coincidenciaDiagS[0].length; x++) {
                    if(coincidenciaDiagS[0][x] == colorminmax){
                        conteoDiagonalS += 1;
                    }
                }
            }

            vertical = []; horizontal = []; diagonalI = []; diagonalS = [];
        }


        return (conteoVertical + conteoHorizontal + conteoDiagonalS + conteoDiagonalI);
    }




    minimax(board, moves, isMaximizingPlayer,depth, alpha, beta, index = 0) {
        if (depth === 0 || moves.length === 0) {
            let mievaluacion = this.evaluate(board,isMaximizingPlayer);
            console.log("mi evaluacion: ",mievaluacion);
            return [mievaluacion, index];
        }
    
        if (isMaximizingPlayer) {
            let bestScore = -Infinity;
            for (let i=0; i < moves.length; i++) {
                const cloneBoard = this.boardManager.clone(board);
                this.boardManager.move(cloneBoard, moves[i], this.color);
                const movesF = this.boardManager.valid_moves(cloneBoard) ;
                const cosas = this.minimax(cloneBoard, movesF, false, depth - 1, alpha, beta, i);
                const score = cosas[0];
                bestScore = Math.max(bestScore, score);
                index = cosas[1];
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break; // Poda alfa-beta
                }
            }
            return [bestScore, index];
        } else {
            let bestScore = Infinity;
            for (let i=0; i < moves.length; i++) {
                const cloneBoard = this.boardManager.clone(board);
                this.boardManager.move(cloneBoard, moves[i], this.noColor); 
                const movesF = this.boardManager.valid_moves(cloneBoard);
                const cosas = this.minimax(cloneBoard, movesF, true, depth - 1, alpha, beta, i);
                const score = cosas[0];
                index = cosas[1];
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break; // Poda alfa-beta
                }
            }
            return [bestScore, index];
        }
    }

    //da las posibilidades que tiene colorminmax para juntar fichas
    evaluate2(board, k, colorminmax){
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