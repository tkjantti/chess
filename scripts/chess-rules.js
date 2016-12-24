
var CHESS_APP = CHESS_APP || {};

CHESS_APP.createRules = function () {

    var getVerticalPosition = function (player, position) {
        if (player === "white") {
            return 7 - position.row;
        } else {
            return position.row;
        }
    };

    var getVerticalMovement = function (source, destination, player) {
        if (player === "white") {
            return source.row - destination.row;
        } else {
            return destination.row - source.row;
        }
    };

    var getHorizontalMovement = function (source, destination) {
        return destination.column - source.column;
    };

    var isHorizontalMove = function (board, source, destination) {
        if (source.row != destination.row) {
            return false;
        }

        var min = Math.min(source.column, destination.column);
        var max = Math.max(source.column, destination.column);

        for (var i = min + 1; i < max; i++) {
            if (board.getPiece(CHESS_APP.createPoint(source.row, i))) {
                return false;
            }
        }

        return true;
    };

    var isVerticalMove = function (board, source, destination) {
        if (source.column != destination.column) {
            return false;
        }

        var min = Math.min(source.row, destination.row);
        var max = Math.max(source.row, destination.row);

        for (var i = min + 1; i < max; i++) {
            if (board.getPiece(CHESS_APP.createPoint(i, source.column))) {
                return false;
            }
        }

        return true;
    };
    
    var isDiagonalMove = function (board, source, destination) {
        if (source.row === destination.row) {
            return false;
        }

        if (Math.abs(destination.column - source.column) != Math.abs(destination.row - source.row)) {
            return false;
        }

        var leftmostPoint = (source.column < destination.column) ? source : destination;
        var rightmostPoint = (source.column > destination.column) ? source : destination;
        var rowStep = (rightmostPoint.row > leftmostPoint.row) ? 1 : -1;

        for (var r = leftmostPoint.row + rowStep, c = leftmostPoint.column + 1;
             c < rightmostPoint.column;
             r += rowStep, c++)
        {
            if (board.getPiece(CHESS_APP.createPoint(r, c))) {
                return false;
            }
        }

        return true;
    };
    
    return {
        opponentPlayer: function (player) {
            return (player === "white") ? "black" : "white";
        },

        isInCheck: function (board, currentPlayer) {
            var opponent = this.opponentPlayer(currentPlayer);
            var positionOfKing = board.getPositionOf(CHESS_APP.createPiece(currentPlayer, "king"));
            var that = this;
            var attackingPiece = board.findPiece(function (piece, position) {
                return (piece.player === opponent) && that.isLegalMove(board, piece, position, positionOfKing);
            });
            return attackingPiece;
        },

        isLegalMove: function (board, piece, source, destination) {
            if (! board.isInside(destination)) {
                return false;
            }

            var pieceAtDestination = board.getPiece(destination);
            if (pieceAtDestination && pieceAtDestination.player === piece.player) {
                return false;
            }
            
            var horizontal = getHorizontalMovement(source, destination);
            var vertical = getVerticalMovement(source, destination, piece.player);

            switch (piece.type) {
            case "pawn":
                var isFirstMove = getVerticalPosition(piece.player, source) === 1;
                var isCorrectLengthForwardMove = (vertical === 1) || (isFirstMove && vertical === 2);
                
                if (isCorrectLengthForwardMove && isVerticalMove(board, source, destination) && !pieceAtDestination) {
                    return true;
                }

                if ((horizontal === -1 || horizontal === 1) && vertical === 1 && pieceAtDestination) {
                    return true;
                }
                
                return false;

            case "knight":
                return (Math.abs(horizontal) === 1 && Math.abs(vertical) === 2)
                    || (Math.abs(horizontal) === 2 && Math.abs(vertical) === 1);

            case "bishop":
                return isDiagonalMove(board, source, destination);
                
            case "rook":
                return isHorizontalMove(board, source, destination) || isVerticalMove(board, source, destination);

            case "queen":
                return isDiagonalMove(board, source, destination)
                    || isHorizontalMove(board, source, destination)
                    || isVerticalMove(board, source, destination);
                
            case "king":
                return (Math.abs(horizontal) <= 1 && Math.abs(vertical) <= 1);
                
            default:
                console.log("unknown piece type: " + piece.type);
                return false;
            };
        }
    };
};
