/* jshint jasmine:true */
/* global CHESS_APP, CHESS_TEST */

describe("Rules", function () {
    "use strict";
    var rules;
    var moveLog;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(CHESS_TEST.pointEquality);
        rules = new CHESS_APP.Rules();
        moveLog = new CHESS_APP.MoveLog();
    });

    describe("opponentPlayer", function () {
        it("should return black when given white", function () {
            var opponent = rules.opponentPlayer("white");
            expect(opponent).toBe("black");
        });

        it("should return white when given black", function () {
            var opponent = rules.opponentPlayer("black");
            expect(opponent).toBe("white");
        });
    });

    describe('isInCheck', function () {
        it('is when the king is under threat', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "   p    ",
                "  K     ",
                "        ",
                "        "
            ]);

            var result = rules.isInCheck(board, "white", moveLog);

            expect(result).toBeTruthy();
        });

        it('is when the king is under threat by several pieces', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                " q p    ",
                "  K    r",
                "    n   ",
                "        "
            ]);

            var result = rules.isInCheck(board, "white", moveLog);

            expect(result).toBeTruthy();
        });

        it('is not when the king is not under threat', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "   r    ",
                "  K     ",
                "        ",
                "        "
            ]);

            var result = rules.isInCheck(board, "white", moveLog);

            expect(result).toBeFalsy();
        });
    });

    describe('isInCheckMate', function () {
        it('not when the king is not under check', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "n       ",
                "      r ",
                "K       "
            ]);

            var result = rules.isInCheckMate(board, "white", moveLog);

            expect(result).toBe(false);
        });

        it('is when the king is in check and can not escape', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "  p     ",
                " q      ",
                "K       "
            ]);

            var result = rules.isInCheckMate(board, "white", moveLog);

            expect(result).toBe(true);
        });

        it('not when the king can move away from attack', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "q       ",
                "        ",
                "K       "
            ]);

            var result = rules.isInCheckMate(board, "white", moveLog);

            expect(result).toBe(false);
        });

        it('not when the king can capture attacking piece', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                " q      ",
                "K       "
            ]);

            var result = rules.isInCheckMate(board, "white", moveLog);

            expect(result).toBe(false);
        });

        it('not when another piece can capture attacking piece', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "  p     ",
                " q     R",
                "K       "
            ]);

            var result = rules.isInCheckMate(board, "white", moveLog);

            expect(result).toBe(false);
        });

        it('not when another piece can go between the king and attacking piece', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "rr      ",
                "        ",
                "        ",
                "        ",
                "        ",
                "       R",
                "K       "
            ]);

            var result = rules.isInCheckMate(board, "white", moveLog);

            expect(result).toBe(false);
        });
    });

    describe('Draw', function () {

        describe('Stalemate', function () {
            it('is not when the player can make a legal move', function () {
                var board = CHESS_TEST.boardState([
                    "    k   ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "       r",
                    "K       "
                ]);

                var result = rules.isDraw(board, "white", moveLog);

                expect(result).toBe(false);
            });

            it('is not when the player can not make a legal move but is in check', function () {
                var board = CHESS_TEST.boardState([
                    "qr      ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "       r",
                    "K       "
                ]);

                var result = rules.isDraw(board, "white", moveLog);

                expect(result).toBe(false);
            });

            it('is when the player can not make a legal move', function () {
                var board = CHESS_TEST.boardState([
                    " r      ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "       r",
                    "K      P"
                ]);

                var result = rules.isDraw(board, "white", moveLog);

                expect(result).toBe(true);
            });

            it('is when the player can not move without becoming in a check position', function () {
                var board = CHESS_TEST.boardState([
                    " r      ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "       r",
                    "K       "
                ]);

                var result = rules.isDraw(board, "white", moveLog);

                expect(result).toBe(true);
            });
        });

        describe('No possibility of checkmate', function () {
            it('is with king against king', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "   k    ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        "
                ]);

                var result = rules.isDraw(board, "white", moveLog);

                expect(result).toBe(true);
            });

            it('is with king against king and bishop', function () {
                var board1 = CHESS_TEST.boardState([
                    "        ",
                    "   k b  ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        "
                ]);

                var board2 = CHESS_TEST.boardState([
                    "        ",
                    "   k    ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K B  ",
                    "        "
                ]);

                var result1 = rules.isDraw(board1, "white", moveLog);
                var result2 = rules.isDraw(board2, "white", moveLog);

                expect(result1).toBe(true);
                expect(result2).toBe(true);
            });

            it('is with king against king and knight', function () {
                var board1 = CHESS_TEST.boardState([
                    "        ",
                    "   k n  ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        "
                ]);

                var board2 = CHESS_TEST.boardState([
                    "        ",
                    "   k    ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K N  ",
                    "        "
                ]);

                var result1 = rules.isDraw(board1, "white", moveLog);
                var result2 = rules.isDraw(board2, "white", moveLog);

                expect(result1).toBe(true);
                expect(result2).toBe(true);
            });

            it('is not if the current player has enough pieces for checkmate', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "   k    ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K R  ",
                    "        "
                ]);

                var result = rules.isDraw(board, "white", moveLog);

                expect(result).toBe(false);
            });

            it('is not if the opposite player has enough pieces for checkmate', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "   k r  ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        "
                ]);

                var result = rules.isDraw(board, "white", moveLog);

                expect(result).toBe(false);
            });
        });
    });

    describe("inspectMove", function () {
        var board;

        var abs = function (board, point) {
            return board.getAbsolutePosition("white", point);
        };
        var getMove = function (p1, p2) {
            return new CHESS_APP.Move("white", abs(board, p1), abs(board, p2));
        };

        it('is not legal if there is no piece in source', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "       P",
                "        ",
                "        ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

            expect(result.isLegal).toBe(false);
        });

        it('is not legal to move opponent player', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                " q      ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

            expect(result.isLegal).toBe(false);
        });

        it('is not legal to capture the king', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "  k     ",
                " P      ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

            expect(result.isLegal).toBe(false);
        });

        it('is ok to capture the king when given extra parameter', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "  k     ",
                " P      ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog, true);

            expect(result.isLegal).toBe(true);
        });

        it('returns a position in which a piece is captured', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "  r     ",
                " P      ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

            expect(result.capturePosition).toEqual(abs(board, p2));
        });

        it('does not return a capture position if no piece is captured', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "   r    ",
                " B      ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

            expect(result.capturePosition).toBeFalsy();
        });

        it('does not return piece if the move is not legal', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                " B      ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 0);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

            expect(result.piece).toBeFalsy();
        });

        it('returns the piece that was moved when the move is legal', function () {
            board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "   r    ",
                " B      ",
                "        ",
                "        "
            ]);

            var p1 = new CHESS_APP.Point(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

            expect(result.piece).toEqual(jasmine.objectContaining({
                player: "white",
                type: "bishop"
            }));
        });

        describe("Pawn", function () {
            it("can move forward one step", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

                expect(result.isLegal).toBe(true);
            });

            it("can not move forward more than one step from the third row", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(2, 1);
                var result2 = rules.inspectMove(board, getMove(p1, p1.add(2, 0)), moveLog);
                var result3 = rules.inspectMove(board, getMove(p1, p1.add(3, 0)), moveLog);
                var result4 = rules.inspectMove(board, getMove(p1, p1.add(4, 0)), moveLog);

                expect(result2.isLegal).toBe(false);
                expect(result3.isLegal).toBe(false);
                expect(result4.isLegal).toBe(false);
            });

            it("can move forward two steps from second row", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(1, 1);
                var p2 = p1.add(2, 0);
                var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

                expect(result.isLegal).toBe(true);
            });

            it("can not move forward more than two steps from second row", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(1, 1);

                var result3 = rules.inspectMove(board, getMove(p1, p1.add(3, 0)), moveLog);
                var result4 = rules.inspectMove(board, getMove(p1, p1.add(4, 0)), moveLog);
                var result5 = rules.inspectMove(board, getMove(p1, p1.add(5, 0)), moveLog);

                expect(result3.isLegal).toBe(false);
                expect(result4.isLegal).toBe(false);
                expect(result5.isLegal).toBe(false);
            });

            it("can not move in other direction than forward", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(2, 1);
                var diagLeftResult = rules.inspectMove(board, getMove(p1, p1.add(1, -1)), moveLog);
                var diagRightResult = rules.inspectMove(board, getMove(p1, p1.add(1, 1)), moveLog);
                var leftResult = rules.inspectMove(board, getMove(p1, p1.add(0, -1)), moveLog);
                var rightResult = rules.inspectMove(board, getMove(p1, p1.add(0, 1)), moveLog);
                var diagBackLeftResult = rules.inspectMove(board, getMove(p1, p1.add(-1, -1)), moveLog);
                var diagBackRightResult = rules.inspectMove(board, getMove(p1, p1.add(-1, 1)), moveLog);
                var backResult = rules.inspectMove(board, getMove(p1, p1.add(-1, 0)), moveLog);

                expect(diagLeftResult.isLegal).toEqual(false);
                expect(diagRightResult.isLegal).toEqual(false);
                expect(leftResult.isLegal).toEqual(false);
                expect(rightResult.isLegal).toEqual(false);
                expect(diagBackLeftResult.isLegal).toEqual(false);
                expect(diagBackRightResult.isLegal).toEqual(false);
                expect(backResult.isLegal).toEqual(false);
            });

            it("can not move when blocked by an own piece", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " Q      ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

                expect(result.isLegal).toBe(false);
            });

            it("can not move when blocked by an opponent piece", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " q      ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

                expect(result.isLegal).toBe(false);
            });

            it("can capture an opponent piece diagonally forward", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "      r ",
                    "q    P  ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(2, 1);
                var p2 = p1.add(1, -1);
                var resultLeft = rules.inspectMove(board, getMove(p1, p2), moveLog);

                p1 = new CHESS_APP.Point(3, 5);
                p2 = p1.add(1, 1);
                var resultRight = rules.inspectMove(board, getMove(p1, p2), moveLog);

                expect(resultLeft.isLegal).toBe(true);
                expect(resultRight.isLegal).toBe(true);
            });

            it("is promoted to queen when it reaches the top of the board", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    " P      ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(6, 1);
                var p2 = p1.add(1, 0);
                var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

                expect(result).toEqual(jasmine.objectContaining({
                    isLegal: true,
                    promotion: "queen"
                }));
            });

            it("is not promoted to queen when it does not reach the top of the board", function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(5, 1);
                var p2 = p1.add(1, 0);
                var result = rules.inspectMove(board, getMove(p1, p2), moveLog);

                expect(result.promotion).toBeFalsy();
            });

            describe('En passant capture', function () {
                it("is not if there is no previous move", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "       r",
                        "        ",
                        " Pp     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var p1 = new CHESS_APP.Point(3, 1);
                    var p2 = new CHESS_APP.Point(2, 2);

                    var move = new CHESS_APP.Move("white", p1, p2);
                    moveLog = new CHESS_APP.MoveLog();

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(false);
                });

                it("is not if previous move was not by a pawn", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "       r",
                        "        ",
                        " Pp     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 1),
                        new CHESS_APP.Point(2, 2)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(0, 7),
                        new CHESS_APP.Point(1, 7)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(false);
                });

                it("is not if the captured piece is not a pawn", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "        ",
                        "        ",
                        " Pr     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 1),
                        new CHESS_APP.Point(2, 2)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(1, 2),
                        new CHESS_APP.Point(3, 2)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(false);
                });

                it("is not if previous move was not two steps by a pawn", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "        ",
                        "        ",
                        " Pp     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 1),
                        new CHESS_APP.Point(2, 2)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(2, 3),
                        new CHESS_APP.Point(3, 3)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(false);
                });

                it("is not if opponent pawn is not next to own", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "        ",
                        "        ",
                        "P p     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 0),
                        new CHESS_APP.Point(2, 1)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(1, 3),
                        new CHESS_APP.Point(3, 3)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(false);
                });

                it("is not if opponent pawn is on the wrong side", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "        ",
                        "        ",
                        " Pp     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 1),
                        new CHESS_APP.Point(2, 0)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(1, 2),
                        new CHESS_APP.Point(3, 2)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(false);
                });

                it("is if previous move was two steps by a pawn on the right", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "        ",
                        "        ",
                        " Pp     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 1),
                        new CHESS_APP.Point(2, 2)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(1, 2),
                        new CHESS_APP.Point(3, 2)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(true);
                });

                it("is if previous move was two steps by a pawn on the left", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "        ",
                        "        ",
                        "pP      ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 1),
                        new CHESS_APP.Point(2, 0)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(1, 0),
                        new CHESS_APP.Point(3, 0)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.isLegal).toBe(true);
                });

                it("sets capture position correctly when capturing en passant", function () {
                    board = CHESS_TEST.boardState([
                        "        ",
                        "        ",
                        "        ",
                        " Pp     ",
                        "        ",
                        "        ",
                        "        ",
                        "        "
                    ]);

                    var move = new CHESS_APP.Move(
                        "white",
                        new CHESS_APP.Point(3, 1),
                        new CHESS_APP.Point(2, 2)
                    );
                    moveLog = CHESS_TEST.LogMove(
                        "black",
                        new CHESS_APP.Point(1, 2),
                        new CHESS_APP.Point(3, 2)
                    );

                    var resultLeft = rules.inspectMove(board, move, moveLog);

                    expect(resultLeft.capturePosition).toEqual(new CHESS_APP.Point(3, 2));
                });
            });
        });

        describe('Rook', function () {
            it('can move horizontally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   R    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 0))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 1))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 2))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 4))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 5))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 6))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 7)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can move vertically', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   R    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(0, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(1, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(2, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(4, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(5, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(6, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(7, 3)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can not move diagonally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   R    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, 2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, 2)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });
        });

        describe('Bishop', function () {
            it('can move diagonally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   B    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, 2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, 2)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can not move horizontally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   B    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 0))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 1))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 2))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 4))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 5))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 6))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 7)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });

            it('can not move vertically', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   B    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(0, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(1, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(2, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(4, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(5, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(6, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(7, 3)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });
        });

        describe('Queen', function () {
            it('can move horizontally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   Q    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 0))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 1))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 2))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 4))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 5))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 6))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 7)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can move vertically', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   Q    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(0, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(1, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(2, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(4, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(5, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(6, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(7, 3)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can move diagonally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   Q    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, 2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, 2)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });
        });

        describe('King', function () {
            it('can move horizontally one square', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 2))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 4)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can not move horizantally more than one square', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 0))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 1))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 5))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 6))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 7)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });

            it('can move vertically one square', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(2, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(4, 3)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can not move vertically more than one square', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(0, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(1, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(5, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(6, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(7, 3)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });

            it('can move diagonally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-1, 1)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can not move diagonally more than one square', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(2, -2))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, 2))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, -2))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, 2)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });
        });

        describe('Knight', function () {
            it('can move two steps forward and one to the side', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(2, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, 1))),

                    rules.inspectMove(board, getMove(p1, p1.add(-2, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, 1))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, -2))),
                    rules.inspectMove(board, getMove(p1, p1.add(1, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, 2))),
                    rules.inspectMove(board, getMove(p1, p1.add(1, 2)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });

            it('can not move horizontally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 0))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 1))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 2))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 4))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 5))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 6))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(3, 7)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });

            it('can not move vertically', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(0, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(1, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(2, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(4, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(5, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(6, 3))),
                    rules.inspectMove(board, getMove(p1, new CHESS_APP.Point(7, 3)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });

            it('can not move diagonally', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, 2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, 1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, 2)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(false);
                });
            });

            it('can move even when there are other pieces around', function () {
                board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "  PBp   ",
                    "  PNr   ",
                    "  RQp   ",
                    "        ",
                    "        "
                ]);

                var p1 = new CHESS_APP.Point(3, 3);
                var results = [
                    rules.inspectMove(board, getMove(p1, p1.add(2, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(2, 1))),

                    rules.inspectMove(board, getMove(p1, p1.add(-2, -1))),
                    rules.inspectMove(board, getMove(p1, p1.add(-2, 1))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, -2))),
                    rules.inspectMove(board, getMove(p1, p1.add(1, -2))),

                    rules.inspectMove(board, getMove(p1, p1.add(-1, 2))),
                    rules.inspectMove(board, getMove(p1, p1.add(1, 2)))
                ];

                results.forEach(function (result) {
                    expect(result.isLegal).toBe(true);
                });
            });
        });
    });
});
