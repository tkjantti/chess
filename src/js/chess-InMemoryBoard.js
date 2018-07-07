
(function (exports) {
    "use strict";

    var InMemoryBoard = function (rowCount, columnCount) {
        CHESS_APP.Board.call(this, rowCount, columnCount);
        this.pieces = []; // A list of piece, position pairs.
    };

    InMemoryBoard.prototype = Object.create(CHESS_APP.Board.prototype);
    InMemoryBoard.prototype.constructor = CHESS_APP.Board;

    InMemoryBoard.prototype.getPiece = function (position) {
        var found = this.pieces.find(function (p) {
            return p.position.equals(position);
        });

        return found ? found.piece : null;
    };

    InMemoryBoard.prototype.setPiece = function (position, piece) {
        if (position == null) {
            throw "position is null";
        }
        if (piece == null) {
            throw "piece is null";
        }

        var existing = this.pieces.find(function (p) {
            return p.position.equals(position);
        });

        if (existing) {
            existing.piece = piece;
        } else {
            this.pieces.push({
                piece: piece,
                position: position
            });
        }
    };

    InMemoryBoard.prototype.removePiece = function (position) {
        var i = this.pieces.findIndex(function (p) {
            return p.position.equals(position);
        });

        if (i >= 0) {
            this.pieces.splice(i, 1);
        }
    };

    InMemoryBoard.prototype.changeTypeOfPiece = function (position, type) {
        this.getPiece(position).type = type;
    };

    InMemoryBoard.prototype.getPositionOf = function (piece) {
        var found = this.findPiece(function (p) {
            return p.equals(piece);
        });
        return found ? found.position : null;
    };

    InMemoryBoard.prototype.findPiece = function (predicate, context) {
        return this.pieces.find(function (p) {
            return predicate.call(context, p.piece, p.position);
        });
    };

    InMemoryBoard.prototype.findPieces = function (predicate) {
        return this.pieces.filter(function (p) {
            return predicate(p.piece, p.position);
        });
    };

    InMemoryBoard.prototype.getPieces = function () {
        return this.pieces;
    };

    InMemoryBoard.prototype.move = function (source, destination) {
        var piece = this.getPiece(source);
        if (!piece) {
            throw "no piece in source position";
        }

        this.removePiece(source);
        this.setPiece(destination, piece);
    };

    exports.InMemoryBoard = InMemoryBoard;

    exports.cloneInMemoryBoard = function (another) {
        var board = new InMemoryBoard(another.getRowCount(), another.getColumnCount());

        another.getPieces().forEach(function (p) {
            board.setPiece(p.position, p.piece);
        });

        return board;
    };
})(this.CHESS_APP = this.CHESS_APP || {});
