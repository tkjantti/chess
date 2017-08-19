
var CHESS_APP = CHESS_APP || {};

(function () {
    "use strict";

    var isNonBlockedHorizontalMove = function (board, move) {
        var min, max, i;

        if (!move.isHorizontal()) {
            return false;
        }

        min = Math.min(move.source.column, move.destination.column);
        max = Math.max(move.source.column, move.destination.column);

        for (i = min + 1; i < max; i += 1) {
            if (board.getPiece(new CHESS_APP.Point(move.source.row, i))) {
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
            if (board.getPiece(new CHESS_APP.Point(i, move.source.column))) {
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

        leftmostPoint = (move.source.column < move.destination.column) ?
                move.source
                : move.destination;
        rightmostPoint = (move.source.column > move.destination.column) ?
                move.source
                : move.destination;
        rowStep = (rightmostPoint.row > leftmostPoint.row) ? 1 : -1;

        r = leftmostPoint.row + rowStep;
        c = leftmostPoint.column + 1;
        while (c < rightmostPoint.column) {
            if (board.getPiece(new CHESS_APP.Point(r, c))) {
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

    var isCorrectForwardMoveForPawn = function (board, player, move) {
        var vertical = board.getRelativeVerticalMovement(player, move.getVerticalMovement());
        var relativePosition = board.getRelativePosition(player, move.source);
        var isAtStartingPosition = relativePosition.row === 1;

        return isNonBlockedVerticalMove(board, move) &&
                ((vertical === 1) || (isAtStartingPosition && vertical === 2)) &&
                !board.getPiece(move.destination);
    };

    var isPawnCapturingDiagonally = function (board, player, move, okToCaptureKing) {
        var horizontal = move.getHorizontalMovement();
        var vertical = board.getRelativeVerticalMovement(player, move.getVerticalMovement());
        var capturedPiece = board.getPiece(move.destination);

        return (horizontal === -1 || horizontal === 1) &&
                vertical === 1 &&
                capturedPiece &&
                canCapture(player, capturedPiece, okToCaptureKing);
    };

    var canBeCapturedEnPassant = function (board, player, move, moveLog, position, okToCaptureKing) {
        var capturedPiece = board.getPiece(position);

        if (moveLog.isEmpty()) {
            return false;
        }
        var previousMove = moveLog.getLast();

        return capturedPiece &&
                capturedPiece.type === "pawn" &&
                canCapture(player, capturedPiece, okToCaptureKing) &&
                previousMove.hasDestination(position) &&
                previousMove.isVerticalWithLengthOfTwo();
    };

    var inspectEnPassant = function (board, player, move, moveLog) {
        var result = {
            isLegal: false
        };

        var horizontal = move.getHorizontalMovement();
        var vertical = board.getRelativeVerticalMovement(player, move.getVerticalMovement());

        if (vertical !== 1) {
            return result;
        }

        var opponentPositionLeft = move.source.add(0, -1);
        var opponentPositionRight = move.source.add(0, 1);

        if (horizontal === -1 && canBeCapturedEnPassant(board, player, move, moveLog, opponentPositionLeft)) {
            result.capturePosition = opponentPositionLeft;
            result.isLegal = true;
        }

        if (horizontal === 1 && canBeCapturedEnPassant(board, player, move, moveLog, opponentPositionRight)) {
            result.capturePosition = opponentPositionRight;
            result.isLegal = true;
        }

        return result;
    };

    var getPawnPromotion = function (board, player, move) {
        var relativePosition = board.getRelativePosition(player, move.destination);
        return (relativePosition.row === board.getRowCount() - 1) ? "queen" : undefined;
    };

    var getLegalInspectionResultsForPiece = function (rules, player, board, position, moveLog) {
        var results = [];

        board.forEachPosition(function (destination) {
            var move = new CHESS_APP.Move(position, destination);
            var inspectionResult = rules.inspectMove(board, player, move, moveLog);
            if (inspectionResult.isLegal) {
                results.push(inspectionResult);
            }
        });

        return results;
    };

    var isInStalemate = function (rules, board, player, moveLog) {
        var ownPieces = board.findPieces(function (piece) {
            return piece.player === player;
        });

        var canMove = function (piece) {
            var legalMoves = getLegalInspectionResultsForPiece(rules, player, board, piece.position, moveLog);
            return legalMoves.some(function (inspectionResult) {
                return !rules.wouldResultInCheck(board, player, inspectionResult, moveLog);
            });
        };

        return !rules.isInCheck(board, player, moveLog) && !ownPieces.some(canMove);
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

    CHESS_APP.Rules = function () {};

    CHESS_APP.Rules.prototype.opponentPlayer = function (player) {
        return (player === "white") ? "black" : "white";
    };

    CHESS_APP.Rules.prototype.updateBoard = function (board, inspectionResult) {
        if (inspectionResult.capturePosition) {
            board.removePiece(inspectionResult.capturePosition);
        }

        inspectionResult.actualMoves.forEach(function (move) {
            board.move(move.source, move.destination);
        });

        if (inspectionResult.promotion) {
            if (inspectionResult.actualMoves.length !== 1) {
                throw "Unexpected count of moves when promoting";
            }
            var move = inspectionResult.actualMoves[0];

            board.changeTypeOfPiece(move.destination, inspectionResult.promotion);
        }
    };

    /*
     * If the move according to inspection result would result in
     * check, returns the position of the piece under
     * threat. Otherwise returns null.
     */
    CHESS_APP.Rules.prototype.wouldResultInCheck = function (board, player, inspectionResult, moveLog) {
        var tempBoard = CHESS_APP.cloneInMemoryBoard(board);
        this.updateBoard(tempBoard, inspectionResult);
        return this.isInCheck(tempBoard, player, moveLog);
    };

    /*
     * If the given player is in check, returns the position of
     * the piece under threat. Otherwise returns null.
     */
    CHESS_APP.Rules.prototype.isInCheck = function (board, player, moveLog) {
        var positionOfKing = board.getPositionOf(new CHESS_APP.Piece(player, "king"));
        if (!positionOfKing) {
            throw "No king found from the board!";
        }
        var opponent = this.opponentPlayer(player);
        var that = this;
        var attackingPiece = board.findPiece(function (piece, position) {
            var move = new CHESS_APP.Move(position, positionOfKing);
            return (piece.player === opponent) &&
                    that.inspectMove(board, opponent, move, moveLog, true).isLegal;
        });
        return attackingPiece ? positionOfKing : null;
    };

    CHESS_APP.Rules.prototype.isInCheckMate = function (board, player, moveLog) {
        var that = this;

        if (!this.isInCheck(board, player, moveLog)) {
            return false;
        }

        var ownPieces = board.findPieces(function (piece) {
            return piece.player === player;
        });

        var canPreventChess = function (piece) {
            var legalMoves = getLegalInspectionResultsForPiece(that, player, board, piece.position, moveLog);

            return legalMoves.some(function (inspectionResult) {
                return !that.wouldResultInCheck(board, player, inspectionResult, moveLog);
            });
        };

        return !ownPieces.some(canPreventChess);
    };

    CHESS_APP.Rules.prototype.isDraw = function (board, player, moveLog) {
        return isInStalemate(this, board, player, moveLog) ||
                isNoPossibilityOfCheckMate(board);
    };

    /*
     * Inspects if the move for the piece in question is legal,
     * without considering if it results in a check position. If the
     * move results in a capture, the return value contains field
     * "capturePosition" with the position from which a piece is
     * captured _after_ the move is performed. In addition, if the
     * move results in a promotion of a piece, the return value
     * contains a field "promotion" with the type that the piece is
     * promoted to.
     */
    CHESS_APP.Rules.prototype.inspectMove = function (board, player, move, moveLog, okToCaptureKing) {
        var piece, pieceAtDestination;
        var horizontal, vertical;
        var enPassantResult;

        if (!board.isInside(move.destination)) {
            return new CHESS_APP.InspectionResult(false);
        }

        piece = board.getPiece(move.source);

        if (!piece || piece.player !== player) {
            return new CHESS_APP.InspectionResult(false);
        }

        pieceAtDestination = board.getPiece(move.destination);
        if (pieceAtDestination && !canCapture(player, pieceAtDestination, okToCaptureKing)) {
            return new CHESS_APP.InspectionResult(false);
        }

        var result = new CHESS_APP.InspectionResult(false);

        if (pieceAtDestination) {
            result.capturePosition = move.destination;
        }

        horizontal = move.getHorizontalMovement();
        vertical = board.getRelativeVerticalMovement(player, move.getVerticalMovement());

        if (piece.type === "king" && horizontal === 2) {
            var relativePosition = board.getRelativePosition(player, move.source);

            if (relativePosition.row !== 0) {
                return new CHESS_APP.InspectionResult(false);
            }

            var rookSource = new CHESS_APP.Point(move.source.row, 7),
                rookDestination = new CHESS_APP.Point(move.source.row, 5);
            var rook = board.getPiece(rookSource);

            if (!rook) {
                return new CHESS_APP.InspectionResult(false);
            }

            var startPositionOfKing = board.getAbsolutePosition(player, new CHESS_APP.Point(0, 4));
            var kingHasMoved = moveLog.hasAnyPieceMovedFrom(startPositionOfKing);

            if (kingHasMoved) {
                return new CHESS_APP.InspectionResult(false);
            }

            var startPositionOfRook = board.getAbsolutePosition(player, new CHESS_APP.Point(0, 7));
            var rookHasMoved = moveLog.hasAnyPieceMovedFrom(startPositionOfRook);

            if (rookHasMoved) {
                return new CHESS_APP.InspectionResult(false);
            }

            var squaresBetweenKingAndRook = [
                board.getAbsolutePosition(player, new CHESS_APP.Point(0, 5)),
                board.getAbsolutePosition(player, new CHESS_APP.Point(0, 6))
            ];
            var anyPiecesBetweenKingAndRook = squaresBetweenKingAndRook.some(function (position) {
                return board.getPiece(position);
            });

            if (anyPiecesBetweenKingAndRook) {
                return new CHESS_APP.InspectionResult(false);
            }

            if (this.isInCheck(board, player, moveLog)) {
                return new CHESS_APP.InspectionResult(false);
            }

            var shortMoveToRight = new CHESS_APP.InspectionResult(
                true,
                [
                    new CHESS_APP.Move(move.source, move.source.add(0, 1))
                ]);
            if (this.wouldResultInCheck(board, player, shortMoveToRight, moveLog)) {
                return new CHESS_APP.InspectionResult(false);
            }

            result.isLegal = true;
            result.castling = CHESS_APP.CASTLING_KING_SIDE;
            result.actualMoves = [
                new CHESS_APP.ActualMove(piece, move.source, move.destination),
                new CHESS_APP.ActualMove(rook, rookSource, rookDestination)
            ];

            if (this.wouldResultInCheck(board, player, result, moveLog)) {
                return new CHESS_APP.InspectionResult(false);
            }

            return result;
        }

        switch (piece.type) {
        case "pawn":
            enPassantResult = inspectEnPassant(board, player, move, moveLog, okToCaptureKing);

            result.isLegal = enPassantResult.isLegal ||
                    isCorrectForwardMoveForPawn(board, player, move) ||
                    isPawnCapturingDiagonally(board, player, move, okToCaptureKing) ||
                    false;

            if (result.isLegal) {
                result.promotion = getPawnPromotion(board, player, move);

                if (enPassantResult.isLegal) {
                    result.capturePosition = enPassantResult.capturePosition;
                }
            }
            break;

        case "knight":
            result.isLegal = (Math.abs(horizontal) === 1 && Math.abs(vertical) === 2) ||
                    (Math.abs(horizontal) === 2 && Math.abs(vertical) === 1);
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
            throw "unknown piece type: " + piece.type;
        }

        if (result.isLegal) {
            result.actualMoves = [
                new CHESS_APP.ActualMove(piece, move.source, move.destination)
            ];
        }

        return result;
    };
}());
