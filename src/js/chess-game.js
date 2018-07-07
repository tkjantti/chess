
(function (exports) {
    "use strict";

    function setState(self, state) {
        self.state = state;
        if (self.onStateChangedHandler) {
            self.onStateChangedHandler(self.state);
        }
    }

    function setCurrentPlayer(self, player) {
        self.currentPlayer = player;
        if (self.onPlayerChangedHandler) {
            self.onPlayerChangedHandler(self.currentPlayer);
        }
    }

    var Game = function (rules) {
        this.rules = rules;
        this.currentPlayer = "white";
        this.moveLog = new CHESS_APP.MoveLog();
        this.storage = new CHESS_APP.Storage();
        this.onPlayerChangedHandler = null;
        this.onStateChangedHandler = null;
        this.state = Game.STATE_GAME_ON;
    };

    Game.STATE_GAME_ON = 0;
    Game.STATE_DRAW = 1;
    Game.STATE_CHECKMATE = 2;

    Game.prototype.load = function (board) {
        var storedMoves = this.storage.loadMoves();
        var moves = CHESS_APP.MoveLog.deserializeMoves(storedMoves);

        this.rules.setStartingPositions(board);

        for (var i = 0; i < moves.length; i++) {
            var move = moves[i];
            this.move(board, move.source, move.destination);
        }
    };

    Game.prototype.save = function () {
        this.storage.saveMoves(this.moveLog.serializeMoves());
    };

    Game.prototype.reset = function (board) {
        this.moveLog.clear();
        this.storage.saveMoves(this.moveLog.serializeMoves());
        this.rules.setStartingPositions(board);
        setCurrentPlayer(this, "white");
        setState(this, Game.STATE_GAME_ON);
    };

    Game.prototype.isFinished = function () {
        return this.state === Game.STATE_DRAW ||
                this.state === Game.STATE_CHECKMATE;
    };

    Game.prototype.getCurrentPlayer = function () {
        return this.currentPlayer;
    };

    Game.prototype.listenCurrentPlayer = function (onPlayerChanged) {
        this.onPlayerChangedHandler = onPlayerChanged;
        this.onPlayerChangedHandler(this.currentPlayer);
    };

    Game.prototype.listenState = function (onStateChanged) {
        this.onStateChangedHandler = onStateChanged;
        this.onStateChangedHandler(this.state);
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
            setState(this, Game.STATE_CHECKMATE);
        } else if (this.rules.isDraw(board, opponent, this.moveLog)) {
            setState(this, Game.STATE_DRAW);
        } else {
            setCurrentPlayer(this, this.rules.opponentPlayer(this.currentPlayer));
        }

        return result;
    };

    exports.Game = Game;
}(this.CHESS_APP = this.CHESS_APP || {}));
