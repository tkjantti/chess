/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

CHESS_APP.createRules = function () {
    "use strict";

    var isNonBlockedHorizontalMove = function (board, move) {
        var min, max, i;

        if (!move.isHorizontal()) {
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

    var isNonBlockedVerticalMove = function (board, move) {
        var min, max, i;

        if (!move.isVertical()) {
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

    var isNonBlockedDiagonalMove = function (board, move) {
        var leftmostPoint, rightmostPoint, rowStep, r, c;

        if (!move.isDiagonal()) {
            return false;
        }

        leftmostPoint = (move.source.column < move.destination.column)
            ? move.source
            : move.destination;
        rightmostPoint = (move.source.column > move.destination.column)
            ? move.source
            : move.destination;
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

        return isNonBlockedVerticalMove(board, move) &&
                ((vertical === 1) || (isAtStartingPosition && vertical === 2)) &&
                !board.getPiece(move.destination);
    };

    var isPawnCapturingDiagonally = function (board, move, okToCaptureKing) {
        var horizontal = move.getHorizontalMovement();
        var vertical = move.getRelativeVerticalMovement();
        var capturedPiece = board.getPiece(move.destination);

        return (horizontal === -1 || horizontal === 1) &&
                vertical === 1 &&
                capturedPiece &&
                canCapture(move.player, capturedPiece, okToCaptureKing);
    };

    var canBeCapturedEnPassant = function (board, move, previousMove, position, okToCaptureKing) {
        var capturedPiece = board.getPiece(position);

        return capturedPiece &&
                capturedPiece.type === "pawn" &&
                canCapture(move.player, capturedPiece, okToCaptureKing) &&
                previousMove &&
                previousMove.getRelativeVerticalMovement() === 2 &&
                previousMove.destination.equals(position);
    };

    var inspectEnPassant = function (board, move, previousMove) {
        var result = {
            isLegal: false
        };

        var horizontal = move.getHorizontalMovement();
        var vertical = move.getRelativeVerticalMovement();

        if (vertical !== 1) {
            return result;
        }

        var opponentPositionLeft = move.source.add(0, -1);
        var opponentPositionRight = move.source.add(0, 1);

        if (horizontal === -1 && canBeCapturedEnPassant(board, move, previousMove, opponentPositionLeft)) {
            result.capturePosition = opponentPositionLeft;
            result.isLegal = true;
        }

        if (horizontal === 1 && canBeCapturedEnPassant(board, move, previousMove, opponentPositionRight)) {
            result.capturePosition = opponentPositionRight;
            result.isLegal = true;
        }

        return result;
    };

    var getPawnPromotion = function (board, move) {
        var relativePosition = board.getRelativePosition(move.player, move.destination);
        return (relativePosition.row === board.getRowCount() - 1)
            ? "queen"
            : undefined;
    };

    var getLegalMovesForPiece = function (rules, player, board, position, previousMove) {
        return board.getPositions(function (destination) {
            var move = CHESS_APP.createMove(player, position, destination);
            return rules.inspectMove(board, move, previousMove).isLegal;
        });
    };

    var isInStalemate = function (rules, board, player, previousMove) {
        var ownPieces = board.findPieces(function (piece, ignore) {
            return piece.player === player;
        });

        var canMove = function (piece) {
            var legalMoves = getLegalMovesForPiece(rules, player, board, piece.position, previousMove);
            return legalMoves.some(function (destination) {
                var b2 = CHESS_APP.cloneInMemoryBoard(board);
                var move = CHESS_APP.createMove(player, piece.position, destination);
                b2.move(piece.position, destination);
                return !rules.isInCheck(b2, player, move);
            });
        };

        return !rules.isInCheck(board, player, previousMove) && !ownPieces.some(canMove);
    };

    var isNoPossibilityOfCheckMate = function (board) {
        var allPieces = board.getPieces().map(function (p) {
            return p.piece;
        });
        var white = allPieces.filter(function (piece) {
            return piece.player === "white";
        }).map(function (piece) {
            return piece.type;
        });

        var black = allPieces.filter(function (piece) {
            return piece.player === "black";
        }).map(function (piece) {
            return piece.type;
        });

        var onlyKing = function (pieces) {
            return pieces.length === 1 && pieces[0] === "king";
        };

        var arrayEquals = function (a1, a2) {
            var i;

            if (a1.length !== a2.length) {
                return false;
            }

            for (i = 0; i < a1.length; i += 1) {
                if (a1[i] !== a2[i]) {
                    return false;
                }
            }

            return true;
        };

        var onlyTwoPieces = function (pieces, p1, p2) {
            return arrayEquals(pieces, [p1, p2]) || arrayEquals(pieces, [p2, p1]);
        };

        if (onlyKing(white) && onlyKing(black)) {
            return true;
        }

        if (onlyKing(white) && onlyTwoPieces(black, "king", "bishop")) {
            return true;
        }

        if (onlyTwoPieces(white, "king", "bishop") && onlyKing(black)) {
            return true;
        }

        if (onlyKing(white) && onlyTwoPieces(black, "king", "knight")) {
            return true;
        }

        if (onlyTwoPieces(white, "king", "knight") && onlyKing(black)) {
            return true;
        }

        return false;
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
        isInCheck: function (board, player, previousMove) {
            var positionOfKing = board.getPositionOf(CHESS_APP.createPiece(player, "king"));
            if (!positionOfKing) {
                throw "No king found from the board!";
            }
            var opponent = this.opponentPlayer(player);
            var that = this;
            var attackingPiece = board.findPiece(function (piece, position) {
                var move = CHESS_APP.createMove(opponent, position, positionOfKing);
                return (piece.player === opponent) &&
                        that.inspectMove(board, move, previousMove, true).isLegal;
            });
            return attackingPiece
                ? positionOfKing
                : null;
        },

        isInCheckMate: function (board, player, previousMove) {
            var that = this;

            if (!this.isInCheck(board, player, previousMove)) {
                return false;
            }

            var ownPieces = board.findPieces(function (piece, ignore) {
                return piece.player === player;
            });

            var canPreventChess = function (piece) {
                var legalMoves = getLegalMovesForPiece(that, player, board, piece.position, previousMove);

                return legalMoves.some(function (destination) {
                    var b2 = CHESS_APP.cloneInMemoryBoard(board);
                    b2.move(piece.position, destination);
                    return !that.isInCheck(b2, player, previousMove);
                });
            };

            return !ownPieces.some(canPreventChess);
        },

        isDraw: function (board, player, previousMove) {
            return isInStalemate(this, board, player, previousMove) ||
                    isNoPossibilityOfCheckMate(board);
        },

        /*
         * Inspects if the move is legal. If the move results in a
         * capture, the return value contains field "capturePosition"
         * with the position from which a piece is captured _after_
         * the move is performed. In addition, if the move results in
         * a promotion of a piece, the return value contains a field
         * "promotion" with the type that the piece is promoted to.
         */
        inspectMove: function (board, move, previousMove, okToCaptureKing) {
            var piece, pieceAtDestination;
            var horizontal, vertical;
            var enPassantResult;

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

            var result = {
                isLegal: false
            };

            if (pieceAtDestination) {
                result.capturePosition = move.destination;
            }

            horizontal = move.getHorizontalMovement();
            vertical = move.getRelativeVerticalMovement();

            switch (piece.type) {
            case "pawn":
                enPassantResult = inspectEnPassant(board, move, previousMove, okToCaptureKing);

                result.isLegal = enPassantResult.isLegal ||
                        isCorrectForwardMoveForPawn(board, move) ||
                        isPawnCapturingDiagonally(board, move, okToCaptureKing) ||
                        false;

                if (result.isLegal) {
                    result.promotion = getPawnPromotion(board, move);

                    if (enPassantResult.isLegal) {
                        result.capturePosition = enPassantResult.capturePosition;
                    }
                }
                break;

            case "knight":
                result.isLegal = (Math.abs(horizontal) === 1 && Math.abs(vertical) === 2)
                        || (Math.abs(horizontal) === 2 && Math.abs(vertical) === 1);
                break;

            case "bishop":
                result.isLegal = isNonBlockedDiagonalMove(board, move);
                break;

            case "rook":
                result.isLegal = isNonBlockedHorizontalMove(board, move) ||
                        isNonBlockedVerticalMove(board, move);
                break;

            case "queen":
                result.isLegal = isNonBlockedDiagonalMove(board, move) ||
                        isNonBlockedHorizontalMove(board, move) ||
                        isNonBlockedVerticalMove(board, move);
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
