
(function (exports) {
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
        "pawn": "",
        "rook": "R",
        "knight": "N",
        "bishop": "B",
        "queen": "Q",
        "king": "K"
    };

    var Piece = function (player, type) {
        if (!symbolMap[type]) {
            throw "Unknown piece type " + type;
        }

        this.player = player;
        this.type = type;
    };

    Piece.prototype.equals = function (another) {
        return another.player === this.player && another.type === this.type;
    };

    Piece.prototype.getMoveNotationSymbol = function () {
        return moveNotationSymbolMap[this.type];
    };

    /*
     * Prints the piece as a single character for testing and debugging.
     */
    Piece.prototype.toString = function () {
        var symbol = symbolMap[this.type];
        if (this.player === "white") {
            return symbol.toUpperCase();
        } else {
            return symbol;
        }
    };

    exports.Piece = Piece;
}(this.CHESS_APP = this.CHESS_APP || {}));
