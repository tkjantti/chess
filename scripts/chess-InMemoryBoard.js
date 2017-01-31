/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

CHESS_APP.createInMemoryBoard = function (rowCount, columnCount) {
    "use strict";
    var rows = [];
    var i;
    for (i = 0; i < rowCount; i += 1) {
        rows[i] = [];
    }

    var that = CHESS_APP.createBoard(rowCount, columnCount);

    that.getPiece = function (position) {
        return rows[position.row][position.column];
    };

    that.setPiece = function (position, piece) {
        rows[position.row][position.column] = piece;
    };

    that.removePiece = function (position) {
        this.setPiece(position, null);
    };

    that.getPositionOf = function (piece) {
        var found = this.findPiece(function (currentPiece) {
            return currentPiece.equals(piece);
        });
        return found
            ? found.position
            : null;
    };

    that.findPiece = function (predicate) {
        var row, column, position, piece;

        for (row = 0; row < this.getRowCount(); row += 1) {
            for (column = 0; column < this.getColumnCount(); column += 1) {
                position = CHESS_APP.createPoint(row, column);
                piece = this.getPiece(position);
                if (piece && predicate(piece, position)) {
                    return {
                        piece: piece,
                        position: position
                    };
                }
            }
        }
        return null;
    };

    that.findPieces = function (predicate) {
        var row, column, position, piece, pieces = [];

        for (row = 0; row < this.getRowCount(); row += 1) {
            for (column = 0; column < this.getColumnCount(); column += 1) {
                position = CHESS_APP.createPoint(row, column);
                piece = this.getPiece(position);
                if (piece && predicate(piece, position)) {
                    pieces.push({
                        piece: piece,
                        position: position
                    });
                }
            }
        }
        return pieces;
    };

    that.move = function (source, destination) {
        var piece = this.getPiece(source);
        if (!piece) {
            console.log("Board.move: piece expected in source");
        }
        this.setPiece(source, null);
        this.setPiece(destination, piece);
    };

    return that;
};

CHESS_APP.cloneInMemoryBoard = function (another) {
    "use strict";
    var board = CHESS_APP.createInMemoryBoard(another.getRowCount(), another.getColumnCount());
    var row, column, position, piece;

    for (row = 0; row < board.getRowCount(); row += 1) {
        for (column = 0; column < board.getColumnCount(); column += 1) {
            position = CHESS_APP.createPoint(row, column);
            piece = another.getPiece(position);
            if (piece) {
                board.setPiece(position, piece);
            }
        }
    }

    return board;
};

