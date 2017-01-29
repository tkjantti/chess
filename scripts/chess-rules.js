/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

CHESS_APP.createRules = function () {
    "use strict";

    /*
     * Returns all legal moves from the given position.
     */
    var getLegalMoves = function (rules, board, position) {
        return board.getPositions(function (destination) {
            return rules.inspectMove(board, position, destination).isLegal;
        });
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

    var canCapture = function (currentPlayer, piece, okToCaptureKing) {
        return (piece.player !== currentPlayer) &&
                (piece.type !== "king" || okToCaptureKing);
    };

    var isCorrectForwardMoveForPawn = function (board, currentPlayer, source, destination) {
        var vertical = getVerticalMovement(source, destination, currentPlayer);
        var relativePosition = board.getRelativePosition(currentPlayer, source);
        var isAtStartingPosition = relativePosition.row === 1;

        return isVerticalMove(board, source, destination) &&
                ((vertical === 1) || (isAtStartingPosition && vertical === 2)) &&
                !board.getPiece(destination);
    };

    var isPawnCapturingDiagonally = function (board, currentPlayer, source, destination) {
        var horizontal = getHorizontalMovement(source, destination);
        var vertical = getVerticalMovement(source, destination, currentPlayer);

        return (horizontal === -1 || horizontal === 1) &&
                vertical === 1 &&
                !!board.getPiece(destination);
    };

    var getPawnPromotion = function (board, currentPlayer, destination) {
        var relativePosition = board.getRelativePosition(currentPlayer, destination);
        return (relativePosition.row === board.getRowCount() - 1)
            ? "queen"
            : undefined;
    };

    return {
        opponentPlayer: function (player) {
            return (player === "white")
                ? "black"
                : "white";
        },

        /*
         * If the given player is in check, returns the position of
         * the piece under threat. Otherwise returns null.
         */
        isInCheck: function (board, player) {
            var opponent = this.opponentPlayer(player);
            var positionOfKing = board.getPositionOf(CHESS_APP.createPiece(player, "king"));
            var that = this;
            var attackingPiece = board.findPiece(function (piece, position) {
                return (piece.player === opponent) &&
                        that.inspectMove(board, position, positionOfKing, true).isLegal;
            });
            return attackingPiece
                ? positionOfKing
                : null;
        },

        isInCheckMate: function (board, player) {
            var that = this;

            if (!this.isInCheck(board, player)) {
                return false;
            }

            var ownPieces = board.findPieces(function (piece, ignore) {
                return piece.player === player;
            });

            var canPreventChess = function (piece) {
                var legalMoves = getLegalMoves(that, board, piece.position);

                return legalMoves.some(function (destination) {
                    var b2 = CHESS_APP.cloneInMemoryBoard(board);
                    b2.move(piece.position, destination);
                    return !that.isInCheck(b2, player);
                });
            };

            return !ownPieces.some(canPreventChess);
        },

        /*
         * Inspects if the move is legal. In addition,
         * if the move results in a promotion of a piece, the return
         * value contains a field "promotion" with the type that the
         * piece is promoted to.
         */
        inspectMove: function (board, source, destination, okToCaptureKing) {
            var piece, pieceAtDestination;
            var horizontal, vertical;

            if (!board.isInside(destination)) {
                return {
                    isLegal: false
                };
            }

            piece = board.getPiece(source);

            if (!piece) {
                return {
                    isLegal: false
                };
            }

            pieceAtDestination = board.getPiece(destination);
            if (pieceAtDestination && !canCapture(piece.player, pieceAtDestination, okToCaptureKing)) {
                return {
                    isLegal: false
                };
            }

            horizontal = getHorizontalMovement(source, destination);
            vertical = getVerticalMovement(source, destination, piece.player);

            var result = {};

            switch (piece.type) {
            case "pawn":
                result.isLegal = isCorrectForwardMoveForPawn(board, piece.player, source, destination) ||
                        isPawnCapturingDiagonally(board, piece.player, source, destination);

                if (result.isLegal) {
                    result.promotion = getPawnPromotion(board, piece.player, destination);
                }
                break;

            case "knight":
                result.isLegal = (Math.abs(horizontal) === 1 && Math.abs(vertical) === 2)
                        || (Math.abs(horizontal) === 2 && Math.abs(vertical) === 1);
                break;

            case "bishop":
                result.isLegal = isDiagonalMove(board, source, destination);
                break;

            case "rook":
                result.isLegal = isHorizontalMove(board, source, destination) ||
                        isVerticalMove(board, source, destination);
                break;

            case "queen":
                result.isLegal = isDiagonalMove(board, source, destination) ||
                        isHorizontalMove(board, source, destination) ||
                        isVerticalMove(board, source, destination);
                break;

            case "king":
                result.isLegal = (Math.abs(horizontal) <= 1 && Math.abs(vertical) <= 1);
                break;

            default:
                console.log("unknown piece type: " + piece.type);
                result.isLegal = false;
                break;
            }

            return result;
        }
    };
};
