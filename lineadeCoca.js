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
        let moves = this.boardManager.valid_moves(board);
        index = this.algoritmo(board,moves);
        
        return moves[index];
    }

    algoritmo(board,moves){
        //indices movimientos ordenados fino
        const ImovesFino = this.searchBestMovement(board,moves,this.color);
        let iFino = ImovesFino.shift();
        const clonTablero = this.boardManager.clone(board);

        if (!iFino) {
            return 0
        }


        //indices movimientos ordenados choto
        this.boardManager.move(clonTablero,moves[iFino],this.noColor);
        moves = this.boardManager.valid_moves(clonTablero);
        const imovesChoto = this.searchBestMovement(clonTablero,moves,this.noColor);
        const iChoto = imovesChoto[0];

        if (iChoto) {
            if (iFino == iChoto) {
                this.algoritmo(board,ImovesFino);
            }else{
                iFino = iChoto;
            }
        }
        return iFino;
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
                    //diagonales 1
                    if(j+k<=size && i+k<=size){                        
                        c1 = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j+h]==colorminmax) c1++
                        if(c1==k) return Infinity
                    }
                    //diagonales 2
                    if(j+1>=k && i+k<=size){                        
                        c2 = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j-h]==colorminmax) c2++
                        if(c2==k) return Infinity

                    }
                    //filas
                    if(j+k<=size){                        
                        c3 = 1
                        for(var h=1;h<k; h++)
                            if(board[i][j+h]==colorminmax) c3++
                        if(c3==k) return Infinity

                    }
                    //columnas
                    if(i+k<=size){
                        c4 = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j]==colorminmax) c4++
                            else break;
                        if(c4==k) return Infinity
                    }
                    console.log("color",colorminmax,"dia1",c1,"dia2",c2,"filas",c3,"col",c4);
                    return c1+c2+c3+c4
                }
            }
        }      
        return ' '
    }

    //organiza los movimientos de mejor a peor
    searchBestMovement(board,moves,colorminmax){
        let iMoves = [];

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const clonTablero = this.boardManager.clone(board);
            this.boardManager.move(clonTablero,move,colorminmax);
            const resultado = this.evaluate(clonTablero, this.k, colorminmax);
            iMoves.push([resultado,i]);          
        }

        iMoves = iMoves.sort((a, b)=> {return a[0] - b[0]});
        console.log(iMoves);
        return iMoves.map((a)=>{return a[1]});
    }

}