/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.createInMemoryBoard = function (rowCount, columnCount) {
    "use strict";
    var pieces = []; // A list of piece, position pairs.

    var that = CHESS_APP.createBoard(rowCount, columnCount);

    that.getPiece = function (position) {
        var found = pieces.find(function (p) {
            return p.position.equals(position);
        });

        return found
            ? found.piece
            : null;
    };

    that.setPiece = function (position, piece) {
        if (position === null) {
            throw "position is null";
        }
        if (piece === null) {
            throw "piece is null";
        }

        var existing = pieces.find(function (p) {
            return p.position.equals(position);
        });

        if (existing) {
            existing.piece = piece;
        } else {
            pieces.push({
                piece: piece,
                position: position
            });
        }
    };

    that.removePiece = function (position) {
        var i = pieces.findIndex(function (p) {
            return p.position.equals(position);
        });

        if (i >= 0) {
            pieces.splice(i, 1);
        }
    };

    that.changeTypeOfPiece = function (position, type) {
        this.getPiece(position).type = type;
    };

    that.getPositionOf = function (piece) {
        var found = this.findPiece(function (p, ignore) {
            return p.equals(piece);
        });
        return found
            ? found.position
            : null;
    };

    that.findPiece = function (predicate) {
        return pieces.find(function (p) {
            return predicate(p.piece, p.position);
        });
    };

    that.findPieces = function (predicate) {
        return pieces.filter(function (p) {
            return predicate(p.piece, p.position);
        });
    };

    that.getPieces = function () {
        return pieces;
    };

    that.move = function (source, destination) {
        var piece = this.getPiece(source);
        if (!piece) {
            throw "no piece in source position";
        }

        this.removePiece(source);
        this.setPiece(destination, piece);
    };

    return that;
};

CHESS_APP.cloneInMemoryBoard = function (another) {
    "use strict";
    var board = CHESS_APP.createInMemoryBoard(another.getRowCount(), another.getColumnCount());

    another.getPieces().forEach(function (p) {
        board.setPiece(p.position, p.piece);
    });

    return board;
};
