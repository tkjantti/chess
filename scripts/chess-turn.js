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
                return CHESS_APP.createMoveResult(move, "bad_move");
            }

            var tempBoard = CHESS_APP.cloneInMemoryBoard(board);
            updateBoard(tempBoard, move, inspectionResult);

            var positionInCheck = rules.isInCheck(tempBoard, currentPlayer, previousMove);

            if (positionInCheck) {
                return CHESS_APP.createMoveResult(move, "bad_move", null, positionInCheck);
            }

            updateBoard(board, move, inspectionResult);

            previousMove = move;

            var result;
            var opponent = rules.opponentPlayer(currentPlayer);

            if (rules.isInCheckMate(board, opponent, previousMove)) {
                result = CHESS_APP.createMoveResult(move, "checkmate", inspectionResult.piece);
            } else if (rules.isDraw(board, opponent, previousMove)) {
                result = CHESS_APP.createMoveResult(move, "draw", inspectionResult.piece);
            } else {
                result = CHESS_APP.createMoveResult(move, "good_move", inspectionResult.piece);
                changePlayer();
            }

            return result;
        }
    };
};
