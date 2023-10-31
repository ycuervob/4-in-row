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
        const index = this.alphaBeta(board);

        console.log("maxConsecutiveEnemy: " + this.maxConsecutiveEnemy(board));

        console.log("index: " + index);

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

    alphaBeta(board) {
        let evaluateIndex = this.minValue(board, -Infinity, Infinity)[1];
        if (evaluateIndex < 0) {
            console.log("random");
            return Math.floor(Math.random() * this.boardManager.valid_moves(board).length);
        }else{
            console.log("alphaBeta");
            return evaluateIndex;
        }
    }

    maxConsecutiveEnemy(board) {
        let n = board.length;
        let colorminmax = this.noColor;
        const patronPunto = new RegExp(`[${colorminmax}]{2,}`, "g");
        let vertical = [];
        let horizontal = [];
        let diagonalI = [];
        let diagonalS = [];

        let conteo = 0;

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

            const coincidenciaVer = verticalStr.match(patronPunto)?.map(function (s) { return s.length; });
            const coincidenciaHor = horizontalStr.match(patronPunto)?.map(function (s) { return s.length; });
            const coincidenciaDiagI = diagonalIStr.match(patronPunto)?.map(function (s) { return s.length; });
            const coincidenciaDiagS = diagonalSStr.match(patronPunto)?.map(function (s) { return s.length; });
            
            console.log("coincidenciaVer: " + coincidenciaVer);
            console.log("coincidenciaHor: " + coincidenciaHor);
            console.log("coincidenciaDiagI: " + coincidenciaDiagI);
            console.log("coincidenciaDiagS: " + coincidenciaDiagS);

            const conteoVertical = coincidenciaVer ? coincidenciaVer.reduce(function(max, length) {return Math.max(max, length);}, 0) : 0;
            const conteoHorizontal = coincidenciaHor ? coincidenciaHor.reduce(function(max, length) {return Math.max(max, length);}, 0) : 0;
            const conteoDiagonalI = coincidenciaDiagI ? coincidenciaDiagI.reduce(function(max, length) {return Math.max(max, length);}, 0) : 0;
            const conteoDiagonalS = coincidenciaDiagS ? coincidenciaDiagS.reduce(function(max, length) {return Math.max(max, length);}, 0) : 0;
            
            conteo = Math.max(conteoVertical, conteoHorizontal, conteoDiagonalI, conteoDiagonalS);
        }

        return conteo;
    }

    maxValue(board, alpha, beta) {
        if (this.winner(board, 2) != ' ') {
            return [this.evaluate(board, true),-1];
        }
        let moves = this.boardManager.valid_moves(board);
        let v = -Infinity;
        let u = -1;
        for (let i=0; i < moves.length; i++) {
            const cloneBoard = this.boardManager.clone(board);
            this.boardManager.move(cloneBoard, moves[i], this.color);
            let minvalue = this.minValue(cloneBoard, alpha, beta);
            v = Math.max(v,minvalue[0]);
            u = (v == minvalue[0]) ? moves[i] : u;
            if (v >= beta) {
                return [v, u]; 
            }
            alpha = Math.max(alpha, v);
        }
        return [v, u];
    }

    minValue(board, alpha, beta) {
        if (this.winner(board, 2) != ' ') {
            return [this.evaluate(board, true),-1];
        }
        let moves = this.boardManager.valid_moves(board);
        let v = Infinity;
        let u = -1;
        for (let i=0; i < moves.length; i++) {
            const cloneBoard = this.boardManager.clone(board);
            this.boardManager.move(cloneBoard, moves[i], this.noColor);
            let maxvalue = this.maxValue(cloneBoard, alpha, beta); 
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