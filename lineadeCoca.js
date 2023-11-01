class LineaDCoca extends Agent {

    constructor() {
        super();
        this.boardManager = new Board();
    }

    winner(board, k){
        var size = board.length
        for( var i=0; i<size; i++){
            for(var j=0; j<size; j++){
                var p = board[i][j]
                if(p!=' '){
                    if(j+k<=size && i+k<=size){                        
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j+h]==p) c++
                        if(c==k) return p
                    }
                    if(j+1>=k && i+k<=size){                        
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j-h]==p) c++
                        if(c==k) return p

                    }
                    if(j+k<=size){                        
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i][j+h]==p) c++
                        if(c==k) return p

                    }
                    if(i+k<=size){
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j]==p) c++
                            else break;
                        if(c==k) return p
                    }
                }
            }
        }      
        return ' '
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
        let depth = this.avgConteoColumna(board);
        console.log("depth: " + depth);
        const index = this.alphaBeta(board, depth);
        console.log("index: " + index);
        console.log("value of borad", this.evaluate(board, true));

        console.log(this.color + ',' + moves[index])
        return moves[index]
    }

    evaluate(board, isMaximizingPlayer) {
        return this.evaluateSingle(board, isMaximizingPlayer) - this.evaluateSingle(board, !isMaximizingPlayer);
    }

    evaluateSingle(board, isMaximizingPlayer) {
        let n = board.length;
        let colorminmax = isMaximizingPlayer ? this.color : this.noColor;
        const patronPunto = new RegExp(`[${colorminmax} ]{${this.k},}`, "g");
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
                conteoVertical = coincidenciaVer[0].length;
            }
            
            if (coincidenciaHor) {
                conteoHorizontal = coincidenciaHor[0].length;
            }
            
            if (coincidenciaDiagI) {
                conteoDiagonalI = coincidenciaDiagI[0].length;
            }

            if (coincidenciaDiagS) {
                conteoDiagonalS = coincidenciaDiagS[0].length;
            }

            vertical = []; horizontal = []; diagonalI = []; diagonalS = [];
        }
        
        return Math.max(conteoVertical, conteoHorizontal, conteoDiagonalS, conteoDiagonalI);
    }

    alphaBeta(board, depth) {
        let evaluateIndex = this.minValue(board, -Infinity, Infinity, depth)[1];
        if (evaluateIndex < 0) {
            console.log("random");
            return Math.floor(Math.random() * this.boardManager.valid_moves(board).length);
        }else{
            console.log("alphaBeta");
            return evaluateIndex;
        }
    }

    avgConteoColumna(board) {
        let n = board.length;
        let conteo = 0;

        for (let i = 0; i < n; i++) {
            let valor_columna = 0;
            for (let j = 0; j < n; j++) {
                if (board[i][j] != ' ') {
                    valor_columna += 1;
                }
            }
            conteo += valor_columna;
        }

        return Math.floor(conteo / n);
    }

    maxValue(board, alpha, beta, depth) {
        if (depth <= 0 || this.winner(board, this.k) != ' ') {
            return [this.evaluate(board, true),-1];
        }
        let moves = this.boardManager.valid_moves(board);
        let v = -Infinity;
        let u = -1;
        for (let i=0; i < moves.length; i++) {
            const cloneBoard = this.boardManager.clone(board);
            this.boardManager.move(cloneBoard, moves[i], this.color);
            let minvalue = this.minValue(cloneBoard, alpha, beta, depth-1);
            v = Math.max(v,minvalue[0]);
            u = (v == minvalue[0]) ? moves[i] : u;
            if (v >= beta) {
                return [v, u]; 
            }
            alpha = Math.max(alpha, v);
        }
        return [v, u];
    }

    minValue(board, alpha, beta, depth) {
        if (depth <= 0 || this.winner(board, this.k) != ' ') {
            return [this.evaluate(board, true),-1];
        }
        let moves = this.boardManager.valid_moves(board);
        let v = Infinity;
        let u = -1;
        for (let i=0; i < moves.length; i++) {
            const cloneBoard = this.boardManager.clone(board);
            this.boardManager.move(cloneBoard, moves[i], this.noColor);
            let maxvalue = this.maxValue(cloneBoard, alpha, beta, depth-1); 
            v = Math.min(v, maxvalue[0]);
            u = (v == maxvalue[0]) ? moves[i] : u;
            if (v >= alpha) {
                return [v, u]; 
            }
            beta = Math.min(beta, v);
        }
        return [v, u];
    }
}