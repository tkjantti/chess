/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.createTurn = function (rules) {
    "use strict";

    var currentPlayer = "white";
    var previousMove = null;
    var onPlayerChangedHandler = null;

    var changePlayer = function () {
        currentPlayer = rules.opponentPlayer(currentPlayer);
        if (onPlayerChangedHandler) {
            onPlayerChangedHandler(currentPlayer);
        }
    };

    var createMoveResult = function (result, positionInCheck) {
        return {
            result: result,
            positionInCheck: positionInCheck,
            isGood: function () {
                return result !== "bad_move";
            },
            isCheckMate: function () {
                return result === "checkmate";
            },
            isDraw: function () {
                return result === "draw";
            }
        };
    };

    var updateBoard = function (board, move, inspectionResult) {
        if (inspectionResult.capturePosition) {
            board.removePiece(inspectionResult.capturePosition);
        }

        board.move(move.source, move.destination);

        if (inspectionResult.promotion) {
            board.changeTypeOfPiece(move.destination, inspectionResult.promotion);
        }
    };

    return {
        getCurrentPlayer: function () {
            return currentPlayer;
        },

        listenCurrentPlayer: function (onPlayerChanged) {
            onPlayerChangedHandler = onPlayerChanged;
            onPlayerChangedHandler(currentPlayer);
        },

        move: function (board, source, destination) {
            var move = CHESS_APP.createMove(currentPlayer, source, destination);

            var inspectionResult = rules.inspectMove(board, move, previousMove);

            if (!inspectionResult.isLegal) {
                return createMoveResult("bad_move");
            }

            var tempBoard = CHESS_APP.cloneInMemoryBoard(board);
            updateBoard(tempBoard, move, inspectionResult);

            var positionInCheck = rules.isInCheck(tempBoard, currentPlayer, previousMove);

            if (positionInCheck) {
                return createMoveResult("bad_move", positionInCheck);
            }

            updateBoard(board, move, inspectionResult);

            previousMove = move;

            var result;
            var opponent = rules.opponentPlayer(currentPlayer);

            if (rules.isInCheckMate(board, opponent, previousMove)) {
                result = createMoveResult("checkmate");
            } else if (rules.isInStalemate(board, opponent, previousMove)) {
                result = createMoveResult("draw");
            } else {
                result = createMoveResult("good_move");
                changePlayer();
            }

            return result;
        }
    };
};
