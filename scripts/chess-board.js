
function createPoint(row, column) {
    return {
        row: row,
        column: column
    };
}

function createPiece(player, type) {
    return {
        player: player,
        type: type,

        equals: function(another) {
            return another.player === this.player && another.type === this.type; 
        }
    };
}

function createBoard() {
    var rows = [[], [], [], [], [], [], [], []];

    return {
        getRowCount: function() { return 8; },
        getColumnCount: function() { return 8; },

        getPiece: function (position) {
            return rows[position.row][position.column];
        },

        setPiece: function (position, piece) {
            rows[position.row][position.column] = piece;
        },

        getPositionOf: function (piece) {
            var found = this.findPiece(function (currentPiece, position) {
                return currentPiece.equals(piece);
            });
            return (found ? found.position : null);
        },

        isInside: function(position) {
            return (0 <= position.row) && (position.row < this.getRowCount()) && (0 <= position.column) && (position.column < this.getColumnCount());
        },
        
        findPiece: function (predicate) {
            for (var row = 0; row < this.getRowCount(); row++) {
                for (var column = 0; column < this.getColumnCount(); column++) {
                    var position = createPoint(row, column);
                    var piece = this.getPiece(position);
                    if (piece && predicate(piece, position)) {
                        return {
                            piece: piece,
                            position: position
                        };
                    }
                }
            }
            return null;
        },

        move: function (source, destination) {
            var piece = this.getPiece(source);
            if (!piece) {
                console.log("Board.move: piece expected in source");
            }
            this.setPiece(source, null);
            this.setPiece(destination, piece);
        }
    };
}

