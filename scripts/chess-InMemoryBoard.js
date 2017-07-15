
var CHESS_APP = CHESS_APP || {};

CHESS_APP.InMemoryBoard = function (rowCount, columnCount) {
    "use strict";
    CHESS_APP.Board.call(this, rowCount, columnCount);
    this.pieces = []; // A list of piece, position pairs.
};

CHESS_APP.InMemoryBoard.prototype = Object.create(CHESS_APP.Board.prototype);
CHESS_APP.InMemoryBoard.prototype.constructor = CHESS_APP.Board;

CHESS_APP.InMemoryBoard.prototype.getPiece = function (position) {
    "use strict";
    var found = this.pieces.find(function (p) {
        return p.position.equals(position);
    });

    return found ? found.piece : null;
};

CHESS_APP.InMemoryBoard.prototype.setPiece = function (position, piece) {
    "use strict";
    if (position === null) {
        throw "position is null";
    }
    if (piece === null) {
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

CHESS_APP.InMemoryBoard.prototype.removePiece = function (position) {
    "use strict";
    var i = this.pieces.findIndex(function (p) {
        return p.position.equals(position);
    });

    if (i >= 0) {
        this.pieces.splice(i, 1);
    }
};

CHESS_APP.InMemoryBoard.prototype.changeTypeOfPiece = function (position, type) {
    "use strict";
    this.getPiece(position).type = type;
};

CHESS_APP.InMemoryBoard.prototype.getPositionOf = function (piece) {
    "use strict";
    var found = this.findPiece(function (p) {
        return p.equals(piece);
    });
    return found ? found.position : null;
};

CHESS_APP.InMemoryBoard.prototype.findPiece = function (predicate) {
    "use strict";
    return this.pieces.find(function (p) {
        return predicate(p.piece, p.position);
    });
};

CHESS_APP.InMemoryBoard.prototype.findPieces = function (predicate) {
    "use strict";
    return this.pieces.filter(function (p) {
        return predicate(p.piece, p.position);
    });
};

CHESS_APP.InMemoryBoard.prototype.getPieces = function () {
    "use strict";
    return this.pieces;
};

CHESS_APP.InMemoryBoard.prototype.move = function (source, destination) {
    "use strict";
    var piece = this.getPiece(source);
    if (!piece) {
        throw "no piece in source position";
    }

    this.removePiece(source);
    this.setPiece(destination, piece);
};


CHESS_APP.cloneInMemoryBoard = function (another) {
    "use strict";
    var board = new CHESS_APP.InMemoryBoard(another.getRowCount(), another.getColumnCount());

    another.getPieces().forEach(function (p) {
        board.setPiece(p.position, p.piece);
    });

    return board;
};
