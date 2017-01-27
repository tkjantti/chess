/*jslint fudge:true */
/*global $, describe, beforeEach, it, xit, expect, CHESS_APP, CHESS_TEST */

describe("Rules", function () {
    "use strict";
    var rules;

    beforeEach(function () {
        rules = CHESS_APP.createRules();
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

            var result = rules.isInCheck(board, "white");

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

            var result = rules.isInCheck(board, "white");

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

            var result = rules.isInCheck(board, "white");

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

            var result = rules.isInCheckMate(board, "white");

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

            var result = rules.isInCheckMate(board, "white");

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

            var result = rules.isInCheckMate(board, "white");

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

            var result = rules.isInCheckMate(board, "white");

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

            var result = rules.isInCheckMate(board, "white");

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

            var result = rules.isInCheckMate(board, "white");

            expect(result).toBe(false);
        });
    });

    describe("isLegalMove", function () {
        var abs = function (board, point) {
            return board.getAbsolutePosition("white", point);
        };

        beforeEach(function () {
            rules = CHESS_APP.createRules();
        });

        it('is not legal to capture the king', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "  k     ",
                " P      ",
                "        ",
                "        "
            ]);

            var p1 = CHESS_APP.createPoint(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

            expect(result).toBeFalsy();
        });

        it('is ok to capture the king when given extra parameter', function () {
            var board = CHESS_TEST.boardState([
                "        ",
                "        ",
                "        ",
                "        ",
                "  k     ",
                " P      ",
                "        ",
                "        "
            ]);

            var p1 = CHESS_APP.createPoint(2, 1);
            var p2 = p1.add(1, 1);
            var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2), true);

            expect(result).toBeTruthy();
        });

        describe("Pawn", function () {
            it("can move forward one step", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBeTruthy();
            });

            it("can not move forward more than one step from the third row", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var result2 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 0)));
                var result3 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(3, 0)));
                var result4 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(4, 0)));

                expect(result2).toBeFalsy();
                expect(result3).toBeFalsy();
                expect(result4).toBeFalsy();
            });

            it("can move forward two steps from second row", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(1, 1);
                var p2 = p1.add(2, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBeTruthy();
            });

            it("can not move forward more than two steps from second row", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(1, 1);

                var result3 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(3, 0)));
                var result4 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(4, 0)));
                var result5 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(5, 0)));

                expect(result3).toBeFalsy();
                expect(result4).toBeFalsy();
                expect(result5).toBeFalsy();
            });

            it("can not move in other direction than forward", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var diagLeftResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -1)));
                var diagRightResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 1)));
                var leftResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(0, -1)));
                var rightResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(0, 1)));
                var diagBackLeftResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -1)));
                var diagBackRightResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 1)));
                var backResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 0)));

                expect(diagLeftResult).toBe(false);
                expect(diagRightResult).toBe(false);
                expect(leftResult).toBe(false);
                expect(rightResult).toBe(false);
                expect(diagBackLeftResult).toBe(false);
                expect(diagBackRightResult).toBe(false);
                expect(backResult).toBe(false);
            });

            it("can not move when blocked by an own piece", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " Q      ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBeFalsy();
            });

            it("can not move when blocked by an opponent piece", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " q      ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBeFalsy();
            });

            it("can capture an opponent piece diagonally forward", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "      r ",
                    "q    P  ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, -1);
                var resultLeft = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                p1 = CHESS_APP.createPoint(3, 5);
                p2 = p1.add(1, 1);
                var resultRight = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(resultLeft).toBeTruthy();
                expect(resultRight).toBeTruthy();
            });

            it("is promoted to queen when it reaches the top of the board", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    " P      ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(6, 1);
                var p2 = p1.add(1, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result.promotion).toBeDefined();
                expect(result.promotion).toBe("queen");
            });
        });

        describe('Rook', function () {
            it('can move horizontally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   R    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 0))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 4))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 5))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 6))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 7)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can move vertically', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   R    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(0, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(1, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(2, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(4, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(5, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(6, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(7, 3)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can not move diagonally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   R    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, 2)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });
        });

        describe('Bishop', function () {
            it('can move diagonally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   B    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, 2)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can not move horizontally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   B    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 0))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 4))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 5))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 6))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 7)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });

            it('can not move vertically', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   B    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(0, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(1, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(2, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(4, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(5, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(6, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(7, 3)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });
        });

        describe('Queen', function () {
            it('can move horizontally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   Q    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 0))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 4))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 5))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 6))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 7)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can move vertically', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   Q    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(0, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(1, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(2, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(4, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(5, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(6, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(7, 3)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can move diagonally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   Q    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, 2)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });
        });

        describe('King', function () {
            it('can move horizontally one square', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 4)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can not move horizantally more than one square', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 0))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 5))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 6))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 7)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });

            it('can move vertically one square', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(2, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(4, 3)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can not move vertically more than one square', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(0, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(1, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(5, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(6, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(7, 3)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });

            it('can move diagonally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 1)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can not move diagonally more than one square', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   K    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, -2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, -2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, 2)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });
        });

        describe('Knight', function () {
            it('can move two steps forward and one to the side', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 1))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, 1))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 2)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });

            it('can not move horizontally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 0))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 4))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 5))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 6))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(3, 7)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });

            it('can not move vertically', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(0, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(1, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(2, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(4, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(5, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(6, 3))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, CHESS_APP.createPoint(7, 3)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });

            it('can not move diagonally', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "   N    ",
                    "        ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, 2)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeFalsy();
                });
            });

            it('can move even when there are other pieces around', function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "  PBp   ",
                    "  PNr   ",
                    "  RQp   ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(3, 3);
                var results = [
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 1))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, -1))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-2, 1))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -2))),

                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 2))),
                    rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 2)))
                ];

                $.each(results, function (ignore, result) {
                    expect(result).toBeTruthy();
                });
            });
        });
    });
});
