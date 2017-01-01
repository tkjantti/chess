/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

CHESS_APP.createRules = function () {
    "use strict";

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
        var min, max, i;

        if (source.row !== destination.row) {
            return false;
        }

        min = Math.min(source.column, destination.column);
        max = Math.max(source.column, destination.column);

        for (i = min + 1; i < max; i += 1) {
            if (board.getPiece(CHESS_APP.createPoint(source.row, i))) {
                return false;
            }
        }

        return true;
    };

    var isVerticalMove = function (board, source, destination) {
        var min, max, i;

        if (source.column !== destination.column) {
            return false;
        }

        min = Math.min(source.row, destination.row);
        max = Math.max(source.row, destination.row);

        for (i = min + 1; i < max; i += 1) {
            if (board.getPiece(CHESS_APP.createPoint(i, source.column))) {
                return false;
            }
        }

        return true;
    };

    var isDiagonalMove = function (board, source, destination) {
        var leftmostPoint, rightmostPoint, rowStep, r, c;

        if (source.row === destination.row) {
            return false;
        }

        if (Math.abs(destination.column - source.column) !== Math.abs(destination.row - source.row)) {
            return false;
        }

        leftmostPoint = (source.column < destination.column)
            ? source
            : destination;
        rightmostPoint = (source.column > destination.column)
            ? source
            : destination;
        rowStep = (rightmostPoint.row > leftmostPoint.row)
            ? 1
            : -1;

        r = leftmostPoint.row + rowStep;
        c = leftmostPoint.column + 1;
        while (c < rightmostPoint.column) {
            if (board.getPiece(CHESS_APP.createPoint(r, c))) {
                return false;
            }

            r += rowStep;
            c += 1;
        }

        return true;
    };

    return {
        opponentPlayer: function (player) {
            return (player === "white")
                ? "black"
                : "white";
        },

        isInCheck: function (board, currentPlayer) {
            var opponent = this.opponentPlayer(currentPlayer);
            var positionOfKing = board.getPositionOf(CHESS_APP.createPiece(currentPlayer, "king"));
            var that = this;
            var attackingPiece = board.findPiece(function (piece, position) {
                return (piece.player === opponent) && that.isLegalMove(board, position, positionOfKing);
            });
            return attackingPiece;
        },

        isLegalMove: function (board, source, destination) {
            var piece, pieceAtDestination;
            var horizontal, vertical, isFirstMove, isCorrectLengthForwardMove;

            if (!board.isInside(destination)) {
                return false;
            }

            piece = board.getPiece(source);

            if (!piece) {
                return false;
            }

            pieceAtDestination = board.getPiece(destination);
            if (pieceAtDestination && pieceAtDestination.player === piece.player) {
                return false;
            }

            horizontal = getHorizontalMovement(source, destination);
            vertical = getVerticalMovement(source, destination, piece.player);

            switch (piece.type) {
            case "pawn":
                isFirstMove = board.getRelativePosition(piece.player, source).row === 1;
                isCorrectLengthForwardMove = (vertical === 1) || (isFirstMove && vertical === 2);

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
            }
        }
    };
};
