
var CHESS_APP = CHESS_APP || {};

(function () {
    "use strict";

    var symbolMap = {
        "pawn": "p",
        "rook": "r",
        "knight": "n",
        "bishop": "b",
        "queen": "q",
        "king": "k"
    };

    var moveNotationSymbolMap = {
        "pawn": "P",
        "rook": "R",
        "knight": "N",
        "bishop": "B",
        "queen": "Q",
        "king": "K"
    };

    CHESS_APP.Piece = function (player, type) {
        if (!symbolMap[type]) {
            throw "Unknown piece type " + type;
        }

        this.player = player;
        this.type = type;
    };

    CHESS_APP.Piece.prototype.equals = function (another) {
        return another.player === this.player && another.type === this.type;
    };

    CHESS_APP.Piece.prototype.getMoveNotationSymbol = function () {
        return moveNotationSymbolMap[this.type];
    };

    /*
     * Prints the piece as a single character for testing and debugging.
     */
    CHESS_APP.Piece.prototype.toString = function () {
        var symbol = symbolMap[this.type];
        if (this.player === "white") {
            return symbol.toUpperCase();
        } else {
            return symbol;
        }
    };
}());
