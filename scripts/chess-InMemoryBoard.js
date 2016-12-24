
var CHESS_APP = CHESS_APP || {};

CHESS_APP.createInMemoryBoard = function () {
    var rows = [[], [], [], [], [], [], [], []];
    var that = CHESS_APP.createBoard();

    that.getPiece = function (position) {
        return rows[position.row][position.column];
    };

    that.setPiece = function (position, piece) {
        rows[position.row][position.column] = piece;
    };

    that.getPositionOf = function (piece) {
        var found = this.findPiece(function (currentPiece, position) {
            return currentPiece.equals(piece);
        });
        return (found ? found.position : null);
    };

    that.findPiece = function (predicate) {
        var row, column, position, piece;

        for (row = 0; row < this.getRowCount(); row++) {
            for (column = 0; column < this.getColumnCount(); column++) {
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
    var board = CHESS_APP.createInMemoryBoard();
    var row, column, position, piece;

    for (row = 0; row < board.getRowCount(); row++) {
        for (column = 0; column < board.getColumnCount(); column++) {
            position = CHESS_APP.createPoint(row, column);
            piece = another.getPiece(position);
            if (piece) {
                board.setPiece(position, piece);
            }
        }
    }

    return board;
};

