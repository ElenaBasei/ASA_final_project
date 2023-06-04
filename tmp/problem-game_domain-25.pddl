;; problem file: problem-game_domain-25.pddl
(define (problem default)
    (:domain default)
    (:objects p14 tile14_8 p19 tile15_9 p16 tile15_1 tile0_6 tile0_12 tile1_0 tile1_1 tile1_2 tile1_3 tile1_4 tile1_5 tile1_6 tile1_12 tile1_13 tile1_14 tile1_15 tile1_16 tile2_2 tile2_6 tile2_7 tile2_8 tile2_9 tile2_10 tile2_11 tile2_12 tile2_16 tile3_2 tile3_6 tile3_12 tile3_16 tile3_17 tile3_18 tile3_19 tile4_2 tile4_6 tile4_12 tile4_16 tile5_0 tile5_1 tile5_2 tile5_3 tile5_4 tile5_5 tile5_6 tile5_9 tile5_10 tile5_11 tile5_12 tile5_16 tile6_1 tile6_6 tile6_7 tile6_8 tile6_9 tile6_12 tile6_13 tile6_14 tile6_15 tile6_16 tile6_17 tile6_18 tile6_19 tile7_1 tile7_6 tile7_9 tile7_12 tile7_16 tile8_1 tile8_2 tile8_3 tile8_4 tile8_5 tile8_6 tile8_9 tile8_12 tile8_16 tile9_1 tile9_4 tile9_6 tile9_9 tile9_12 tile9_13 tile9_14 tile9_15 tile9_16 tile9_17 tile9_18 tile10_1 tile10_4 tile10_6 tile10_9 tile10_12 tile10_14 tile10_18 tile11_0 tile11_1 tile11_2 tile11_3 tile11_4 tile11_6 tile11_7 tile11_8 tile11_9 tile11_10 tile11_11 tile11_12 tile11_14 tile11_18 tile12_2 tile12_6 tile12_8 tile12_12 tile12_14 tile12_18 tile13_2 tile13_6 tile13_8 tile13_12 tile13_14 tile13_16 tile13_17 tile13_18 tile13_19 tile14_2 tile14_6 tile14_12 tile14_14 tile14_15 tile14_16 tile15_0 tile15_2 tile15_3 tile15_4 tile15_5 tile15_6 tile15_8 tile15_10 tile15_11 tile15_12 tile15_16 tile16_2 tile16_6 tile16_9 tile16_12 tile16_13 tile16_14 tile16_15 tile16_16 tile16_17 tile16_18 tile16_19 tile17_2 tile17_6 tile17_7 tile17_8 tile17_9 tile17_12 tile17_16 tile18_2 tile18_6 tile18_9 tile18_12 tile18_16 tile19_2 tile19_6 tile19_9 tile19_12 tile19_16)
    (:init (is-pack p14) (pack-in p14 tile14_8) (is-pack p19) (pack-in p19 tile15_9) (is-pack p16) (pack-in p16 tile15_1) (free) (obstacle tile14_8) (is-tile tile0_6) (is-delivery-tile tile0_6) (is-tile tile0_12) (is-delivery-tile tile0_12) (is-tile tile1_0) (is-delivery-tile tile1_0) (is-tile tile1_1) (is-tile tile1_2) (is-tile tile1_3) (is-tile tile1_4) (is-tile tile1_5) (is-tile tile1_6) (is-tile tile1_12) (is-tile tile1_13) (is-tile tile1_14) (is-tile tile1_15) (is-tile tile1_16) (is-tile tile2_2) (is-tile tile2_6) (is-tile tile2_7) (is-tile tile2_8) (is-tile tile2_9) (is-tile tile2_10) (is-tile tile2_11) (is-tile tile2_12) (is-tile tile2_16) (is-tile tile3_2) (is-tile tile3_6) (is-tile tile3_12) (is-tile tile3_16) (is-tile tile3_17) (is-tile tile3_18) (is-tile tile3_19) (is-delivery-tile tile3_19) (is-tile tile4_2) (is-tile tile4_6) (is-tile tile4_12) (is-tile tile4_16) (is-tile tile5_0) (is-delivery-tile tile5_0) (is-tile tile5_1) (is-tile tile5_2) (is-tile tile5_3) (is-tile tile5_4) (is-tile tile5_5) (is-tile tile5_6) (is-tile tile5_9) (is-tile tile5_10) (is-tile tile5_11) (is-tile tile5_12) (is-tile tile5_16) (is-tile tile6_1) (is-tile tile6_6) (is-tile tile6_7) (is-tile tile6_8) (is-tile tile6_9) (is-tile tile6_12) (is-tile tile6_13) (is-tile tile6_14) (is-tile tile6_15) (is-tile tile6_16) (is-tile tile6_17) (is-tile tile6_18) (is-tile tile6_19) (is-delivery-tile tile6_19) (is-tile tile7_1) (is-tile tile7_6) (is-tile tile7_9) (is-tile tile7_12) (is-tile tile7_16) (is-tile tile8_1) (is-tile tile8_2) (is-tile tile8_3) (is-tile tile8_4) (is-tile tile8_5) (is-tile tile8_6) (is-tile tile8_9) (is-tile tile8_12) (is-tile tile8_16) (is-tile tile9_1) (is-tile tile9_4) (is-tile tile9_6) (is-tile tile9_9) (is-tile tile9_12) (is-tile tile9_13) (is-tile tile9_14) (is-tile tile9_15) (is-tile tile9_16) (is-tile tile9_17) (is-tile tile9_18) (is-tile tile10_1) (is-tile tile10_4) (is-tile tile10_6) (is-tile tile10_9) (is-tile tile10_12) (is-tile tile10_14) (is-tile tile10_18) (is-tile tile11_0) (is-delivery-tile tile11_0) (is-tile tile11_1) (is-tile tile11_2) (is-tile tile11_3) (is-tile tile11_4) (is-tile tile11_6) (is-tile tile11_7) (is-tile tile11_8) (is-tile tile11_9) (is-tile tile11_10) (is-tile tile11_11) (is-tile tile11_12) (is-tile tile11_14) (is-tile tile11_18) (is-tile tile12_2) (is-tile tile12_6) (is-tile tile12_8) (is-tile tile12_12) (is-tile tile12_14) (is-tile tile12_18) (is-tile tile13_2) (is-tile tile13_6) (is-tile tile13_8) (is-tile tile13_12) (is-tile tile13_14) (is-tile tile13_16) (is-tile tile13_17) (is-tile tile13_18) (is-tile tile13_19) (is-delivery-tile tile13_19) (is-tile tile14_2) (is-tile tile14_6) (is-tile tile14_8) (is-tile tile14_12) (is-tile tile14_14) (is-tile tile14_15) (is-tile tile14_16) (is-tile tile15_0) (is-delivery-tile tile15_0) (is-tile tile15_1) (is-tile tile15_2) (is-tile tile15_3) (is-tile tile15_4) (is-tile tile15_5) (is-tile tile15_6) (is-tile tile15_8) (is-tile tile15_9) (is-tile tile15_10) (is-tile tile15_11) (is-tile tile15_12) (is-tile tile15_16) (is-tile tile16_2) (is-tile tile16_6) (is-tile tile16_9) (is-tile tile16_12) (is-tile tile16_13) (is-tile tile16_14) (is-tile tile16_15) (is-tile tile16_16) (is-tile tile16_17) (is-tile tile16_18) (is-tile tile16_19) (is-delivery-tile tile16_19) (is-tile tile17_2) (is-tile tile17_6) (is-tile tile17_7) (is-tile tile17_8) (is-tile tile17_9) (is-tile tile17_12) (is-tile tile17_16) (is-tile tile18_2) (is-tile tile18_6) (is-tile tile18_9) (is-tile tile18_12) (is-tile tile18_16) (is-tile tile19_2) (is-delivery-tile tile19_2) (is-tile tile19_6) (is-delivery-tile tile19_6) (is-tile tile19_9) (is-delivery-tile tile19_9) (is-tile tile19_12) (is-delivery-tile tile19_12) (is-tile tile19_16) (is-delivery-tile tile19_16) (is-right tile0_6 tile1_6) (is-right tile0_12 tile1_12) (is-up tile1_0 tile1_1) (is-up tile1_1 tile1_2) (is-down tile1_1 tile1_0) (is-right tile1_2 tile2_2) (is-up tile1_2 tile1_3) (is-down tile1_2 tile1_1) (is-up tile1_3 tile1_4) (is-down tile1_3 tile1_2) (is-up tile1_4 tile1_5) (is-down tile1_4 tile1_3) (is-up tile1_5 tile1_6) (is-down tile1_5 tile1_4) (is-right tile1_6 tile2_6) (is-left tile1_6 tile0_6) (is-down tile1_6 tile1_5) (is-right tile1_12 tile2_12) (is-left tile1_12 tile0_12) (is-up tile1_12 tile1_13) (is-up tile1_13 tile1_14) (is-down tile1_13 tile1_12) (is-up tile1_14 tile1_15) (is-down tile1_14 tile1_13) (is-up tile1_15 tile1_16) (is-down tile1_15 tile1_14) (is-right tile1_16 tile2_16) (is-down tile1_16 tile1_15) (is-right tile2_2 tile3_2) (is-left tile2_2 tile1_2) (is-right tile2_6 tile3_6) (is-left tile2_6 tile1_6) (is-up tile2_6 tile2_7) (is-up tile2_7 tile2_8) (is-down tile2_7 tile2_6) (is-up tile2_8 tile2_9) (is-down tile2_8 tile2_7) (is-up tile2_9 tile2_10) (is-down tile2_9 tile2_8) (is-up tile2_10 tile2_11) (is-down tile2_10 tile2_9) (is-up tile2_11 tile2_12) (is-down tile2_11 tile2_10) (is-right tile2_12 tile3_12) (is-left tile2_12 tile1_12) (is-down tile2_12 tile2_11) (is-right tile2_16 tile3_16) (is-left tile2_16 tile1_16) (is-right tile3_2 tile4_2) (is-left tile3_2 tile2_2) (is-right tile3_6 tile4_6) (is-left tile3_6 tile2_6) (is-right tile3_12 tile4_12) (is-left tile3_12 tile2_12) (is-right tile3_16 tile4_16) (is-left tile3_16 tile2_16) (is-up tile3_16 tile3_17) (is-up tile3_17 tile3_18) (is-down tile3_17 tile3_16) (is-up tile3_18 tile3_19) (is-down tile3_18 tile3_17) (is-down tile3_19 tile3_18) (is-right tile4_2 tile5_2) (is-left tile4_2 tile3_2) (is-right tile4_6 tile5_6) (is-left tile4_6 tile3_6) (is-right tile4_12 tile5_12) (is-left tile4_12 tile3_12) (is-right tile4_16 tile5_16) (is-left tile4_16 tile3_16) (is-up tile5_0 tile5_1) (is-right tile5_1 tile6_1) (is-up tile5_1 tile5_2) (is-down tile5_1 tile5_0) (is-left tile5_2 tile4_2) (is-up tile5_2 tile5_3) (is-down tile5_2 tile5_1) (is-up tile5_3 tile5_4) (is-down tile5_3 tile5_2) (is-up tile5_4 tile5_5) (is-down tile5_4 tile5_3) (is-up tile5_5 tile5_6) (is-down tile5_5 tile5_4) (is-right tile5_6 tile6_6) (is-left tile5_6 tile4_6) (is-down tile5_6 tile5_5) (is-right tile5_9 tile6_9) (is-up tile5_9 tile5_10) (is-up tile5_10 tile5_11) (is-down tile5_10 tile5_9) (is-up tile5_11 tile5_12) (is-down tile5_11 tile5_10) (is-right tile5_12 tile6_12) (is-left tile5_12 tile4_12) (is-down tile5_12 tile5_11) (is-right tile5_16 tile6_16) (is-left tile5_16 tile4_16) (is-right tile6_1 tile7_1) (is-left tile6_1 tile5_1) (is-right tile6_6 tile7_6) (is-left tile6_6 tile5_6) (is-up tile6_6 tile6_7) (is-up tile6_7 tile6_8) (is-down tile6_7 tile6_6) (is-up tile6_8 tile6_9) (is-down tile6_8 tile6_7) (is-right tile6_9 tile7_9) (is-left tile6_9 tile5_9) (is-down tile6_9 tile6_8) (is-right tile6_12 tile7_12) (is-left tile6_12 tile5_12) (is-up tile6_12 tile6_13) (is-up tile6_13 tile6_14) (is-down tile6_13 tile6_12) (is-up tile6_14 tile6_15) (is-down tile6_14 tile6_13) (is-up tile6_15 tile6_16) (is-down tile6_15 tile6_14) (is-right tile6_16 tile7_16) (is-left tile6_16 tile5_16) (is-up tile6_16 tile6_17) (is-down tile6_16 tile6_15) (is-up tile6_17 tile6_18) (is-down tile6_17 tile6_16) (is-up tile6_18 tile6_19) (is-down tile6_18 tile6_17) (is-down tile6_19 tile6_18) (is-right tile7_1 tile8_1) (is-left tile7_1 tile6_1) (is-right tile7_6 tile8_6) (is-left tile7_6 tile6_6) (is-right tile7_9 tile8_9) (is-left tile7_9 tile6_9) (is-right tile7_12 tile8_12) (is-left tile7_12 tile6_12) (is-right tile7_16 tile8_16) (is-left tile7_16 tile6_16) (is-right tile8_1 tile9_1) (is-left tile8_1 tile7_1) (is-up tile8_1 tile8_2) (is-up tile8_2 tile8_3) (is-down tile8_2 tile8_1) (is-up tile8_3 tile8_4) (is-down tile8_3 tile8_2) (is-right tile8_4 tile9_4) (is-up tile8_4 tile8_5) (is-down tile8_4 tile8_3) (is-up tile8_5 tile8_6) (is-down tile8_5 tile8_4) (is-right tile8_6 tile9_6) (is-left tile8_6 tile7_6) (is-down tile8_6 tile8_5) (is-right tile8_9 tile9_9) (is-left tile8_9 tile7_9) (is-right tile8_12 tile9_12) (is-left tile8_12 tile7_12) (is-right tile8_16 tile9_16) (is-left tile8_16 tile7_16) (is-right tile9_1 tile10_1) (is-left tile9_1 tile8_1) (is-right tile9_4 tile10_4) (is-left tile9_4 tile8_4) (is-right tile9_6 tile10_6) (is-left tile9_6 tile8_6) (is-right tile9_9 tile10_9) (is-left tile9_9 tile8_9) (is-right tile9_12 tile10_12) (is-left tile9_12 tile8_12) (is-up tile9_12 tile9_13) (is-up tile9_13 tile9_14) (is-down tile9_13 tile9_12) (is-right tile9_14 tile10_14) (is-up tile9_14 tile9_15) (is-down tile9_14 tile9_13) (is-up tile9_15 tile9_16) (is-down tile9_15 tile9_14) (is-left tile9_16 tile8_16) (is-up tile9_16 tile9_17) (is-down tile9_16 tile9_15) (is-up tile9_17 tile9_18) (is-down tile9_17 tile9_16) (is-right tile9_18 tile10_18) (is-down tile9_18 tile9_17) (is-right tile10_1 tile11_1) (is-left tile10_1 tile9_1) (is-right tile10_4 tile11_4) (is-left tile10_4 tile9_4) (is-right tile10_6 tile11_6) (is-left tile10_6 tile9_6) (is-right tile10_9 tile11_9) (is-left tile10_9 tile9_9) (is-right tile10_12 tile11_12) (is-left tile10_12 tile9_12) (is-right tile10_14 tile11_14) (is-left tile10_14 tile9_14) (is-right tile10_18 tile11_18) (is-left tile10_18 tile9_18) (is-up tile11_0 tile11_1) (is-left tile11_1 tile10_1) (is-up tile11_1 tile11_2) (is-down tile11_1 tile11_0) (is-right tile11_2 tile12_2) (is-up tile11_2 tile11_3) (is-down tile11_2 tile11_1) (is-up tile11_3 tile11_4) (is-down tile11_3 tile11_2) (is-left tile11_4 tile10_4) (is-down tile11_4 tile11_3) (is-right tile11_6 tile12_6) (is-left tile11_6 tile10_6) (is-up tile11_6 tile11_7) (is-up tile11_7 tile11_8) (is-down tile11_7 tile11_6) (is-right tile11_8 tile12_8) (is-up tile11_8 tile11_9) (is-down tile11_8 tile11_7) (is-left tile11_9 tile10_9) (is-up tile11_9 tile11_10) (is-down tile11_9 tile11_8) (is-up tile11_10 tile11_11) (is-down tile11_10 tile11_9) (is-up tile11_11 tile11_12) (is-down tile11_11 tile11_10) (is-right tile11_12 tile12_12) (is-left tile11_12 tile10_12) (is-down tile11_12 tile11_11) (is-right tile11_14 tile12_14) (is-left tile11_14 tile10_14) (is-right tile11_18 tile12_18) (is-left tile11_18 tile10_18) (is-right tile12_2 tile13_2) (is-left tile12_2 tile11_2) (is-right tile12_6 tile13_6) (is-left tile12_6 tile11_6) (is-right tile12_8 tile13_8) (is-left tile12_8 tile11_8) (is-right tile12_12 tile13_12) (is-left tile12_12 tile11_12) (is-right tile12_14 tile13_14) (is-left tile12_14 tile11_14) (is-right tile12_18 tile13_18) (is-left tile12_18 tile11_18) (is-right tile13_2 tile14_2) (is-left tile13_2 tile12_2) (is-right tile13_6 tile14_6) (is-left tile13_6 tile12_6) (is-right tile13_8 tile14_8) (is-left tile13_8 tile12_8) (is-right tile13_12 tile14_12) (is-left tile13_12 tile12_12) (is-right tile13_14 tile14_14) (is-left tile13_14 tile12_14) (is-right tile13_16 tile14_16) (is-up tile13_16 tile13_17) (is-up tile13_17 tile13_18) (is-down tile13_17 tile13_16) (is-left tile13_18 tile12_18) (is-up tile13_18 tile13_19) (is-down tile13_18 tile13_17) (is-down tile13_19 tile13_18) (is-right tile14_2 tile15_2) (is-left tile14_2 tile13_2) (is-right tile14_6 tile15_6) (is-left tile14_6 tile13_6) (is-right tile14_8 tile15_8) (is-left tile14_8 tile13_8) (is-right tile14_12 tile15_12) (is-left tile14_12 tile13_12) (is-left tile14_14 tile13_14) (is-up tile14_14 tile14_15) (is-up tile14_15 tile14_16) (is-down tile14_15 tile14_14) (is-right tile14_16 tile15_16) (is-left tile14_16 tile13_16) (is-down tile14_16 tile14_15) (is-up tile15_0 tile15_1) (is-up tile15_1 tile15_2) (is-down tile15_1 tile15_0) (is-right tile15_2 tile16_2) (is-left tile15_2 tile14_2) (is-up tile15_2 tile15_3) (is-down tile15_2 tile15_1) (is-up tile15_3 tile15_4) (is-down tile15_3 tile15_2) (is-up tile15_4 tile15_5) (is-down tile15_4 tile15_3) (is-up tile15_5 tile15_6) (is-down tile15_5 tile15_4) (is-right tile15_6 tile16_6) (is-left tile15_6 tile14_6) (is-down tile15_6 tile15_5) (is-left tile15_8 tile14_8) (is-up tile15_8 tile15_9) (is-right tile15_9 tile16_9) (is-up tile15_9 tile15_10) (is-down tile15_9 tile15_8) (is-up tile15_10 tile15_11) (is-down tile15_10 tile15_9) (is-up tile15_11 tile15_12) (is-down tile15_11 tile15_10) (is-right tile15_12 tile16_12) (is-left tile15_12 tile14_12) (is-down tile15_12 tile15_11) (is-right tile15_16 tile16_16) (is-left tile15_16 tile14_16) (is-right tile16_2 tile17_2) (is-left tile16_2 tile15_2) (is-right tile16_6 tile17_6) (is-left tile16_6 tile15_6) (is-right tile16_9 tile17_9) (is-left tile16_9 tile15_9) (is-right tile16_12 tile17_12) (is-left tile16_12 tile15_12) (is-up tile16_12 tile16_13) (is-up tile16_13 tile16_14) (is-down tile16_13 tile16_12) (is-up tile16_14 tile16_15) (is-down tile16_14 tile16_13) (is-up tile16_15 tile16_16) (is-down tile16_15 tile16_14) (is-right tile16_16 tile17_16) (is-left tile16_16 tile15_16) (is-up tile16_16 tile16_17) (is-down tile16_16 tile16_15) (is-up tile16_17 tile16_18) (is-down tile16_17 tile16_16) (is-up tile16_18 tile16_19) (is-down tile16_18 tile16_17) (is-down tile16_19 tile16_18) (is-right tile17_2 tile18_2) (is-left tile17_2 tile16_2) (is-right tile17_6 tile18_6) (is-left tile17_6 tile16_6) (is-up tile17_6 tile17_7) (is-up tile17_7 tile17_8) (is-down tile17_7 tile17_6) (is-up tile17_8 tile17_9) (is-down tile17_8 tile17_7) (is-right tile17_9 tile18_9) (is-left tile17_9 tile16_9) (is-down tile17_9 tile17_8) (is-right tile17_12 tile18_12) (is-left tile17_12 tile16_12) (is-right tile17_16 tile18_16) (is-left tile17_16 tile16_16) (is-right tile18_2 tile19_2) (is-left tile18_2 tile17_2) (is-right tile18_6 tile19_6) (is-left tile18_6 tile17_6) (is-right tile18_9 tile19_9) (is-left tile18_9 tile17_9) (is-right tile18_12 tile19_12) (is-left tile18_12 tile17_12) (is-right tile18_16 tile19_16) (is-left tile18_16 tile17_16) (is-left tile19_2 tile18_2) (is-left tile19_6 tile18_6) (is-left tile19_9 tile18_9) (is-left tile19_12 tile18_12) (is-left tile19_16 tile18_16) (on tile13_8))
    (:goal (and (holding p14)))
)
