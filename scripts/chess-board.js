
function Point(row, column) {
    this.row = row;
    this.column = column;
}

function Piece(player, type) {
    this.player = player;
    this.type = type;
}

Piece.prototype.equals = function(another) {
    return another.player === this.player && another.type === this.type; 
};

function PieceAtPosition(piece, position) {
    this.piece = piece;
    this.position = position;
}

function Board() {
    this.rowCount = 8;
    this.columnCount = 8;
    this.rows = [
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount)
    ];
}

Board.prototype.getPiece = function (position) {
    return this.rows[position.row][position.column];
};

Board.prototype.setPiece = function (position, piece) {
    this.rows[position.row][position.column] = piece;
};

Board.prototype.getPositionOf = function (piece) {
    var found = this.findPiece(function (currentPiece, position) {
        return currentPiece.equals(piece);
    });
    return (found ? found.position : null);
};

Board.prototype.findPiece = function (predicate) {
    for (var row = 0; row < this.rowCount; row++) {
        for (var column = 0; column < this.columnCount; column++) {
            var position = new Point(row, column);
            var piece = this.getPiece(position);
            if (piece && predicate(piece, position)) {
                return new PieceAtPosition(piece, position);
            }
        }
    }
    return null;
};

Board.prototype.move = function (source, destination) {
    var piece = this.getPiece(source);
    if (!piece) {
        console.log("Board.move: piece expected in source");
    }
    this.setPiece(source, null);
    this.setPiece(destination, piece);
};

