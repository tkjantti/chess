/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

CHESS_APP.createRules = function () {
    "use strict";

    /*
     * Returns all legal moves from the given position for the given
     * player.
     */
    var getLegalMoves = function (rules, player, board, position) {
        return board.getPositions(function (destination) {
            var move = CHESS_APP.createMove(player, position, destination);
            return rules.inspectMove(board, move).isLegal;
        });
    };

    var isHorizontalMove = function (board, move) {
        var min, max, i;

        if (move.source.row !== move.destination.row) {
            return false;
        }

        min = Math.min(move.source.column, move.destination.column);
        max = Math.max(move.source.column, move.destination.column);

        for (i = min + 1; i < max; i += 1) {
            if (board.getPiece(CHESS_APP.createPoint(move.source.row, i))) {
                return false;
            }
        }

        return true;
    };

    var isVerticalMove = function (board, move) {
        var min, max, i;

        if (move.source.column !== move.destination.column) {
            return false;
        }

        min = Math.min(move.source.row, move.destination.row);
        max = Math.max(move.source.row, move.destination.row);

        for (i = min + 1; i < max; i += 1) {
            if (board.getPiece(CHESS_APP.createPoint(i, move.source.column))) {
                return false;
            }
        }

        return true;
    };

    var isDiagonalMove = function (board, move) {
        var leftmostPoint, rightmostPoint, rowStep, r, c;
        var source = move.source, destination = move.destination;

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

    var isCorrectForwardMoveForPawn = function (board, move) {
        var vertical = move.getRelativeVerticalMovement();
        var relativePosition = board.getRelativePosition(move.player, move.source);
        var isAtStartingPosition = relativePosition.row === 1;

        return isVerticalMove(board, move) &&
                ((vertical === 1) || (isAtStartingPosition && vertical === 2)) &&
                !board.getPiece(move.destination);
    };

    var isPawnCapturingDiagonally = function (board, move) {
        var horizontal = move.getHorizontalMovement();
        var vertical = move.getRelativeVerticalMovement();

        return (horizontal === -1 || horizontal === 1) &&
                vertical === 1 &&
                !!board.getPiece(move.destination);
    };

    var getPawnPromotion = function (board, move) {
        var relativePosition = board.getRelativePosition(move.player, move.destination);
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
                var move = CHESS_APP.createMove(opponent, position, positionOfKing);
                return (piece.player === opponent) &&
                        that.inspectMove(board, move, true).isLegal;
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
                var legalMoves = getLegalMoves(that, player, board, piece.position);

                return legalMoves.some(function (destination) {
                    var b2 = CHESS_APP.cloneInMemoryBoard(board);
                    b2.move(piece.position, destination);
                    return !that.isInCheck(b2, player);
                });
            };

            return !ownPieces.some(canPreventChess);
        },

        /*
         * Inspects if the move is legal. In addition, if the move
         * results in a promotion of a piece, the return value
         * contains a field "promotion" with the type that the piece
         * is promoted to.
         */
        inspectMove: function (board, move, okToCaptureKing) {
            var piece, pieceAtDestination;
            var horizontal, vertical;

            if (!board.isInside(move.destination)) {
                return {
                    isLegal: false
                };
            }

            piece = board.getPiece(move.source);

            if (!piece || piece.player !== move.player) {
                return {
                    isLegal: false
                };
            }

            pieceAtDestination = board.getPiece(move.destination);
            if (pieceAtDestination && !canCapture(move.player, pieceAtDestination, okToCaptureKing)) {
                return {
                    isLegal: false
                };
            }

            var result = {};

            if (pieceAtDestination) {
                result.capturePosition = move.destination;
            }

            horizontal = move.getHorizontalMovement();
            vertical = move.getRelativeVerticalMovement();

            switch (piece.type) {
            case "pawn":
                result.isLegal = isCorrectForwardMoveForPawn(board, move) ||
                        isPawnCapturingDiagonally(board, move);

                if (result.isLegal) {
                    result.promotion = getPawnPromotion(board, move);
                }
                break;

            case "knight":
                result.isLegal = (Math.abs(horizontal) === 1 && Math.abs(vertical) === 2)
                        || (Math.abs(horizontal) === 2 && Math.abs(vertical) === 1);
                break;

            case "bishop":
                result.isLegal = isDiagonalMove(board, move);
                break;

            case "rook":
                result.isLegal = isHorizontalMove(board, move) ||
                        isVerticalMove(board, move);
                break;

            case "queen":
                result.isLegal = isDiagonalMove(board, move) ||
                        isHorizontalMove(board, move) ||
                        isVerticalMove(board, move);
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
