
var CHESS_APP = CHESS_APP || {};

(function () {
    "use strict";

    var updateBoard = function (board, move, inspectionResult) {
        if (inspectionResult.capturePosition) {
            board.removePiece(inspectionResult.capturePosition);
        }

        board.move(move.source, move.destination);

        if (inspectionResult.promotion) {
            board.changeTypeOfPiece(move.destination, inspectionResult.promotion);
        }
    };

    CHESS_APP.Turn = function (rules) {
        this.rules = rules;
        this.currentPlayer = "white";
        this.previousMove = null;
        this.onPlayerChangedHandler = null;
    };

    CHESS_APP.Turn.prototype.changePlayer = function () {
        this.currentPlayer = this.rules.opponentPlayer(this.currentPlayer);
        if (this.onPlayerChangedHandler) {
            this.onPlayerChangedHandler(this.currentPlayer);
        }
    };

    CHESS_APP.Turn.prototype.getCurrentPlayer = function () {
        return this.currentPlayer;
    };

    CHESS_APP.Turn.prototype.listenCurrentPlayer = function (onPlayerChanged) {
        this.onPlayerChangedHandler = onPlayerChanged;
        this.onPlayerChangedHandler(this.currentPlayer);
    };

    CHESS_APP.Turn.prototype.move = function (board, source, destination) {
        var move = new CHESS_APP.Move(this.currentPlayer, source, destination);

        var inspectionResult = this.rules.inspectMove(board, move, this.previousMove);

        if (!inspectionResult.isLegal) {
            return new CHESS_APP.MoveResult(move, "bad_move");
        }

        var tempBoard = CHESS_APP.cloneInMemoryBoard(board);
        updateBoard(tempBoard, move, inspectionResult);

        var positionInCheck = this.rules.isInCheck(tempBoard, this.currentPlayer, this.previousMove);

        if (positionInCheck) {
            return new CHESS_APP.MoveResult(move, "bad_move", null, positionInCheck);
        }

        updateBoard(board, move, inspectionResult);

        this.previousMove = move;

        var result;
        var opponent = this.rules.opponentPlayer(this.currentPlayer);

        if (this.rules.isInCheckMate(board, opponent, this.previousMove)) {
            result = new CHESS_APP.MoveResult(move, "checkmate", inspectionResult.piece);
        } else if (this.rules.isDraw(board, opponent, this.previousMove)) {
            result = new CHESS_APP.MoveResult(move, "draw", inspectionResult.piece);
        } else {
            result = new CHESS_APP.MoveResult(move, "good_move", inspectionResult.piece);
            this.changePlayer();
        }

        return result;
    };
}());
