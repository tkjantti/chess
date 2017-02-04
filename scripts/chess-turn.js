/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.createTurn = function (rules) {
    "use strict";

    var currentPlayer = "white";
    var onPlayerChangedHandler = null;

    var changePlayer = function () {
        currentPlayer = rules.opponentPlayer(currentPlayer);
        if (onPlayerChangedHandler) {
            onPlayerChangedHandler(currentPlayer);
        }
    };

    var createMove = function (result, positionInCheck) {
        return {
            result: result,
            positionInCheck: positionInCheck,
            isGood: function () {
                return result !== "bad_move";
            },
            isCheckMate: function () {
                return result === "checkmate";
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

            var inspectionResult = rules.inspectMove(board, move);

            if (!inspectionResult.isLegal) {
                return createMove("bad_move");
            }

            var tempBoard = CHESS_APP.cloneInMemoryBoard(board);
            updateBoard(tempBoard, move, inspectionResult);

            var positionInCheck = rules.isInCheck(tempBoard, currentPlayer);

            if (positionInCheck) {
                return createMove("bad_move", positionInCheck);
            }

            updateBoard(board, move, inspectionResult);

            if (rules.isInCheckMate(board, rules.opponentPlayer(currentPlayer))) {
                return createMove("checkmate");
            }

            changePlayer();

            return createMove("good_move");
        }
    };
};
