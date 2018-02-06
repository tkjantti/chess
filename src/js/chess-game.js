
(function (exports) {
    "use strict";

    var STATE_GAME_ON = 0;
    var STATE_DRAW = 1;
    var STATE_CHECKMATE = 2;

    var Game = function (rules) {
        this.rules = rules;
        this.currentPlayer = "white";
        this.moveLog = new CHESS_APP.MoveLog();
        this.onPlayerChangedHandler = null;
        this.state = STATE_GAME_ON;
    };

    Game.prototype.isFinished = function () {
        return this.state === STATE_DRAW ||
                this.state === STATE_CHECKMATE;
    };

    Game.prototype.isInDraw = function () {
        return this.state === STATE_DRAW;
    };

    Game.prototype.isInCheckmate = function () {
        return this.state === STATE_CHECKMATE;
    };

    Game.prototype.changePlayer = function () {
        this.currentPlayer = this.rules.opponentPlayer(this.currentPlayer);
        if (this.onPlayerChangedHandler) {
            this.onPlayerChangedHandler(this.currentPlayer);
        }
    };

    Game.prototype.getCurrentPlayer = function () {
        return this.currentPlayer;
    };

    Game.prototype.listenCurrentPlayer = function (onPlayerChanged) {
        this.onPlayerChangedHandler = onPlayerChanged;
        this.onPlayerChangedHandler(this.currentPlayer);
    };

    Game.prototype.move = function (board, source, destination) {
        var move = new CHESS_APP.Move(source, destination);

        var inspectionResult = this.rules.inspectMove(board, this.currentPlayer, move, this.moveLog);

        if (!inspectionResult.isLegal) {
            return new CHESS_APP.MoveResult(false, inspectionResult.actualMoves);
        }

        var positionInCheck = this.rules.wouldResultInCheck(board, this.currentPlayer, inspectionResult, this.moveLog);

        if (positionInCheck) {
            return new CHESS_APP.MoveResult(false, inspectionResult.actualMoves, positionInCheck);
        }

        this.rules.updateBoard(board, inspectionResult);

        var result = new CHESS_APP.MoveResult(
            true,
            inspectionResult.actualMoves,
            null,
            inspectionResult.castling);
        this.moveLog.add(result);

        var opponent = this.rules.opponentPlayer(this.currentPlayer);

        if (this.rules.isInCheckMate(board, opponent, this.moveLog)) {
            this.state = STATE_CHECKMATE;
        } else if (this.rules.isDraw(board, opponent, this.moveLog)) {
            this.state = STATE_DRAW;
        } else {
            this.changePlayer();
        }

        return result;
    };

    exports.Game = Game;
}(this.CHESS_APP = this.CHESS_APP || {}));
