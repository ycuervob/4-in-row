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
        this.initTime = 1000*parseInt(Konekti.vc('time').value); // time in seconds
        this.k = parseInt(Konekti.vc('k').value); // k-pieces in row
    }

    compute(board, time) {
        let moves = this.boardManager.valid_moves(board);
        let movement = this.algoritmo(board,moves);
        //console.log("Jugada definitiva: ",movement);
        return movement;
    }

    algoritmo(board,moves){
        //indices movimientos ordenados fino
        const ImovesFino = this.searchBestMovement(board,moves,this.color);
        let Fino = ImovesFino.pop();
        //console.log("Fino: ",Fino);

        if (Fino == "INFINITY") return ImovesFino.pop();

        const clonTablero = this.boardManager.clone(board);

        //indices movimientos ordenados choto
        this.boardManager.move(clonTablero,Fino,this.color);
        moves = this.boardManager.valid_moves(clonTablero);
        const imovesChoto = this.searchBestMovement(clonTablero,moves,this.noColor);
        const Choto = imovesChoto.pop();

        const clonTablero2 = this.boardManager.clone(board);

        //indices movimientos ordenados choto2
        this.boardManager.move(clonTablero2,ImovesFino[ImovesFino.length-1],this.color);
        moves = this.boardManager.valid_moves(clonTablero2);
        const imovesChoto2 = this.searchBestMovement(clonTablero2,moves,this.noColor);
        const Choto2 = imovesChoto2.pop();

        //console.log("Choto: ",Choto);
        //console.log("Choto2: ",Choto2);

        if (Choto == "INFINITY") {
            let chotoresutl = imovesChoto.pop();
            //console.log("Choto resuelto: ",chotoresutl);
            return chotoresutl;
        };

        const mejorJugada = Fino;
        
        if (Choto != undefined) {
            if (Fino == Choto) {
                Fino = this.algoritmo(board, ImovesFino);
            }else{
                Fino = Choto;
            }
        }
        
        if(Choto2 == "INFINITY") {
            Fino = mejorJugada;
        }

        if(Choto == "INFINITY" && Choto2 == "INFINITY") { 
            return imovesChoto.pop();
        }

        return Fino;
    }

    //da las posibilidades que tiene colorminmax para juntar fichas
    //Esto se ejecuta si la ficha es del color de color minmax
    evaluate(board, k, colorminmax){
        var size = board.length;
        var puntaje = 0;

        //recorre el tablero cada ficha es una i,j
        for( var i=0; i<size; i++){
            for(var j=0; j<size; j++){

                //asigna la ficha p
                var p = board[i][j]
                //Esto se ejecuta si la ficha NO es un espacio vacio
                if(p == colorminmax){
                    //se declaran los contadores de las fichas en una columna, fila o diagonal
                    let c1 = 0;
                    let c2 = 0;
                    let c3 = 0;
                    let c4 = 0;

                    //diagonales 1 cuenta el numero de fichas en una diagonal 
                    //esto se ejecuta si son diagonales de tamaño k
                    if(j+k<=size && i+k<=size){     
                        //Se inicia el contador en uno                   
                        c1 = 1;
                        let c = 1;
                        for(var h=1;h<k; h++){
                            if(board[i+h][j+h]==colorminmax){
                                c1++;
                                c++;
                            }else if(board[i+h][j+h] != ' '){
                                c1 = 0;
                                break;
                            }
                        }

                        if(c==k) return Infinity
                    }

                    //diagonales 2 cuenta el numero de fichas en una diagonal
                    //esto se ejecuta si son diagonales de tamaño k
                    if(j+1>=k && i+k<=size){                        
                        c2 = 1;
                        let c = 1;
                        for(var h=1;h<k; h++){
                            if(board[i+h][j-h]==colorminmax){
                                c2++;
                                c++;
                            }else if(board[i+h][j-h] != ' '){
                                c2 = 0;
                                break;
                            }
                        }
                        if(c==k) return Infinity
                    }

                    //filas cuenta el numero de fichas en una fila
                    //esto se ejecuta si son filas de tamaño k
                    if(j+k<=size){                        
                        c3 = 1;
                        let c = 1;
                        for(var h=1;h<k; h++){
                                if(board[i][j+h]==colorminmax){
                                    c3++;
                                    c++;
                                }else if(board[i][j+h] != ' '){
                                    c3 = 0;
                                    break;
                                }
                            }
                        if(c==k) return Infinity
                    }

                    //columnas cuenta el numero de fichas en una columna
                    //esto se ejecuta si son columnas de tamaño k
                    if(i+k<=size){
                        c4 = 1
                        let c = 1;
                        for(var h=1;h<k; h++){
                            if(board[i+h][j]==colorminmax){
                                c4++;
                                c++;
                            } else if(board[i+h][j] != ' '){
                                c4 = 0;
                                break;
                            }
                        }   
                           
                        if(c==k) return Infinity
                    }
                    
                    //console.log("color",colorminmax,"dia1",c1,"dia2",c2,"filas",c3,"col",c4);
                    
                    
                    puntaje += Math.max(c1,c2,c3,c4);
                }

            }
        }      
        return puntaje;
    }

    //organiza los movimientos de mejor a peor
    searchBestMovement(board,moves,colorminmax){
        let iMoves = [];

        //console.log("Movimientos: ",moves, "colorminmax",colorminmax);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const clonTablero = this.boardManager.clone(board);
            this.boardManager.move(clonTablero,move,colorminmax);
            const resultado = this.evaluate(clonTablero, this.k, colorminmax);

            //console.log("move",move,"resultado",resultado,"i",i, "colorminmax",colorminmax);
            //console.log("tabla",clonTablero);

            if(resultado == Infinity) {
                //console.log("Jugada ganadora: ",move, colorminmax);
                return [move, "INFINITY"]
            }
            iMoves.push([resultado,move]);          
        }

        iMoves = iMoves.sort((a, b)=> {return a[0] - b[0]});
        //console.log(colorminmax,iMoves);
        return iMoves.map((a)=>{return a[1]});
    }

}