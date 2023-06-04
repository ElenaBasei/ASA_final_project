;; problem file: problem-game_domain-73.pddl
(define (problem default)
    (:domain default)
    (:objects p2364 tile15_8 p2365 tile16_16 p2366 tile12_1 tile0_5 tile0_6 tile0_15 tile0_16 tile1_0 tile1_1 tile1_2 tile1_3 tile1_4 tile1_5 tile1_6 tile1_7 tile1_13 tile1_14 tile1_15 tile1_16 tile1_17 tile1_18 tile2_0 tile2_1 tile2_2 tile2_3 tile2_4 tile2_5 tile2_6 tile2_7 tile2_13 tile2_14 tile2_15 tile2_16 tile2_17 tile2_18 tile3_6 tile3_7 tile3_8 tile3_9 tile3_10 tile3_11 tile3_12 tile3_13 tile3_14 tile3_17 tile3_18 tile4_6 tile4_7 tile4_8 tile4_9 tile4_10 tile4_11 tile4_12 tile4_13 tile4_14 tile4_17 tile4_18 tile5_0 tile5_1 tile5_2 tile5_3 tile5_4 tile5_5 tile5_6 tile5_7 tile5_13 tile5_14 tile5_15 tile5_16 tile5_17 tile5_18 tile5_19 tile6_0 tile6_1 tile6_2 tile6_3 tile6_4 tile6_5 tile6_6 tile6_7 tile6_13 tile6_14 tile6_15 tile6_16 tile6_17 tile6_18 tile6_19 tile7_1 tile7_2 tile7_6 tile7_7 tile7_15 tile7_16 tile8_1 tile8_2 tile8_6 tile8_7 tile8_11 tile8_12 tile8_13 tile8_14 tile8_15 tile8_16 tile9_1 tile9_2 tile9_6 tile9_7 tile9_8 tile9_9 tile9_10 tile9_11 tile9_12 tile9_13 tile9_14 tile9_15 tile9_16 tile10_1 tile10_2 tile10_6 tile10_7 tile10_8 tile10_9 tile10_10 tile10_11 tile10_12 tile10_15 tile10_16 tile10_17 tile10_18 tile10_19 tile11_0 tile11_1 tile11_2 tile11_3 tile11_4 tile11_5 tile11_6 tile11_7 tile11_11 tile11_12 tile11_15 tile11_16 tile11_17 tile11_18 tile11_19 tile12_0 tile12_2 tile12_3 tile12_4 tile12_5 tile12_6 tile12_7 tile12_11 tile12_12 tile12_17 tile12_18 tile13_3 tile13_4 tile13_11 tile13_12 tile13_17 tile13_18 tile14_3 tile14_4 tile14_11 tile14_12 tile14_17 tile14_18 tile15_0 tile15_1 tile15_2 tile15_3 tile15_4 tile15_5 tile15_6 tile15_7 tile15_9 tile15_10 tile15_11 tile15_12 tile15_13 tile15_14 tile15_15 tile15_16 tile15_17 tile15_18 tile15_19 tile16_0 tile16_1 tile16_2 tile16_3 tile16_4 tile16_5 tile16_6 tile16_7 tile16_8 tile16_9 tile16_10 tile16_11 tile16_12 tile16_13 tile16_14 tile16_15 tile16_17 tile16_18 tile16_19 tile17_2 tile17_3 tile17_8 tile17_9 tile17_14 tile17_15 tile18_2 tile18_3 tile18_8 tile18_9 tile18_14 tile18_15 tile19_2 tile19_3 tile19_8 tile19_9 tile19_14 tile19_15)
    (:init (is-pack p2364) (pack-in p2364 tile15_8) (is-pack p2365) (pack-in p2365 tile16_16) (is-pack p2366) (pack-in p2366 tile12_1) (free) (is-tile tile0_5) (is-delivery-tile tile0_5) (is-tile tile0_6) (is-delivery-tile tile0_6) (is-tile tile0_15) (is-delivery-tile tile0_15) (is-tile tile0_16) (is-delivery-tile tile0_16) (is-tile tile1_0) (is-delivery-tile tile1_0) (is-tile tile1_1) (is-tile tile1_2) (is-tile tile1_3) (is-tile tile1_4) (is-tile tile1_5) (is-tile tile1_6) (is-tile tile1_7) (is-tile tile1_13) (is-tile tile1_14) (is-tile tile1_15) (is-tile tile1_16) (is-tile tile1_17) (is-tile tile1_18) (is-tile tile2_0) (is-delivery-tile tile2_0) (is-tile tile2_1) (is-tile tile2_2) (is-tile tile2_3) (is-tile tile2_4) (is-tile tile2_5) (is-tile tile2_6) (is-tile tile2_7) (is-tile tile2_13) (is-tile tile2_14) (is-tile tile2_15) (is-tile tile2_16) (is-tile tile2_17) (is-tile tile2_18) (is-tile tile3_6) (is-tile tile3_7) (is-tile tile3_8) (is-tile tile3_9) (is-tile tile3_10) (is-tile tile3_11) (is-tile tile3_12) (is-tile tile3_13) (is-tile tile3_14) (is-tile tile3_17) (is-tile tile3_18) (is-tile tile4_6) (is-tile tile4_7) (is-tile tile4_8) (is-tile tile4_9) (is-tile tile4_10) (is-tile tile4_11) (is-tile tile4_12) (is-tile tile4_13) (is-tile tile4_14) (is-tile tile4_17) (is-tile tile4_18) (is-tile tile5_0) (is-delivery-tile tile5_0) (is-tile tile5_1) (is-tile tile5_2) (is-tile tile5_3) (is-tile tile5_4) (is-tile tile5_5) (is-tile tile5_6) (is-tile tile5_7) (is-tile tile5_13) (is-tile tile5_14) (is-tile tile5_15) (is-tile tile5_16) (is-tile tile5_17) (is-tile tile5_18) (is-tile tile5_19) (is-delivery-tile tile5_19) (is-tile tile6_0) (is-delivery-tile tile6_0) (is-tile tile6_1) (is-tile tile6_2) (is-tile tile6_3) (is-tile tile6_4) (is-tile tile6_5) (is-tile tile6_6) (is-tile tile6_7) (is-tile tile6_13) (is-tile tile6_14) (is-tile tile6_15) (is-tile tile6_16) (is-tile tile6_17) (is-tile tile6_18) (is-tile tile6_19) (is-delivery-tile tile6_19) (is-tile tile7_1) (is-tile tile7_2) (is-tile tile7_6) (is-tile tile7_7) (is-tile tile7_15) (is-tile tile7_16) (is-tile tile8_1) (is-tile tile8_2) (is-tile tile8_6) (is-tile tile8_7) (is-tile tile8_11) (is-tile tile8_12) (is-tile tile8_13) (is-tile tile8_14) (is-tile tile8_15) (is-tile tile8_16) (is-tile tile9_1) (is-tile tile9_2) (is-tile tile9_6) (is-tile tile9_7) (is-tile tile9_8) (is-tile tile9_9) (is-tile tile9_10) (is-tile tile9_11) (is-tile tile9_12) (is-tile tile9_13) (is-tile tile9_14) (is-tile tile9_15) (is-tile tile9_16) (is-tile tile10_1) (is-tile tile10_2) (is-tile tile10_6) (is-tile tile10_7) (is-tile tile10_8) (is-tile tile10_9) (is-tile tile10_10) (is-tile tile10_11) (is-tile tile10_12) (is-tile tile10_15) (is-tile tile10_16) (is-tile tile10_17) (is-tile tile10_18) (is-tile tile10_19) (is-delivery-tile tile10_19) (is-tile tile11_0) (is-delivery-tile tile11_0) (is-tile tile11_1) (is-tile tile11_2) (is-tile tile11_3) (is-tile tile11_4) (is-tile tile11_5) (is-tile tile11_6) (is-tile tile11_7) (is-tile tile11_11) (is-tile tile11_12) (is-tile tile11_15) (is-tile tile11_16) (is-tile tile11_17) (is-tile tile11_18) (is-tile tile11_19) (is-delivery-tile tile11_19) (is-tile tile12_0) (is-delivery-tile tile12_0) (is-tile tile12_1) (is-tile tile12_2) (is-tile tile12_3) (is-tile tile12_4) (is-tile tile12_5) (is-tile tile12_6) (is-tile tile12_7) (is-tile tile12_11) (is-tile tile12_12) (is-tile tile12_17) (is-tile tile12_18) (is-tile tile13_3) (is-tile tile13_4) (is-tile tile13_11) (is-tile tile13_12) (is-tile tile13_17) (is-tile tile13_18) (is-tile tile14_3) (is-tile tile14_4) (is-tile tile14_11) (is-tile tile14_12) (is-tile tile14_17) (is-tile tile14_18) (is-tile tile15_0) (is-delivery-tile tile15_0) (is-tile tile15_1) (is-tile tile15_2) (is-tile tile15_3) (is-tile tile15_4) (is-tile tile15_5) (is-tile tile15_6) (is-tile tile15_7) (is-tile tile15_8) (is-tile tile15_9) (is-tile tile15_10) (is-tile tile15_11) (is-tile tile15_12) (is-tile tile15_13) (is-tile tile15_14) (is-tile tile15_15) (is-tile tile15_16) (is-tile tile15_17) (is-tile tile15_18) (is-tile tile15_19) (is-delivery-tile tile15_19) (is-tile tile16_0) (is-delivery-tile tile16_0) (is-tile tile16_1) (is-tile tile16_2) (is-tile tile16_3) (is-tile tile16_4) (is-tile tile16_5) (is-tile tile16_6) (is-tile tile16_7) (is-tile tile16_8) (is-tile tile16_9) (is-tile tile16_10) (is-tile tile16_11) (is-tile tile16_12) (is-tile tile16_13) (is-tile tile16_14) (is-tile tile16_15) (is-tile tile16_16) (is-tile tile16_17) (is-tile tile16_18) (is-tile tile16_19) (is-delivery-tile tile16_19) (is-tile tile17_2) (is-tile tile17_3) (is-tile tile17_8) (is-tile tile17_9) (is-tile tile17_14) (is-tile tile17_15) (is-tile tile18_2) (is-tile tile18_3) (is-tile tile18_8) (is-tile tile18_9) (is-tile tile18_14) (is-tile tile18_15) (is-tile tile19_2) (is-delivery-tile tile19_2) (is-tile tile19_3) (is-delivery-tile tile19_3) (is-tile tile19_8) (is-delivery-tile tile19_8) (is-tile tile19_9) (is-delivery-tile tile19_9) (is-tile tile19_14) (is-delivery-tile tile19_14) (is-tile tile19_15) (is-delivery-tile tile19_15) (is-right tile0_5 tile1_5) (is-up tile0_5 tile0_6) (is-right tile0_6 tile1_6) (is-down tile0_6 tile0_5) (is-right tile0_15 tile1_15) (is-up tile0_15 tile0_16) (is-right tile0_16 tile1_16) (is-down tile0_16 tile0_15) (is-right tile1_0 tile2_0) (is-up tile1_0 tile1_1) (is-right tile1_1 tile2_1) (is-up tile1_1 tile1_2) (is-down tile1_1 tile1_0) (is-right tile1_2 tile2_2) (is-up tile1_2 tile1_3) (is-down tile1_2 tile1_1) (is-right tile1_3 tile2_3) (is-up tile1_3 tile1_4) (is-down tile1_3 tile1_2) (is-right tile1_4 tile2_4) (is-up tile1_4 tile1_5) (is-down tile1_4 tile1_3) (is-right tile1_5 tile2_5) (is-left tile1_5 tile0_5) (is-up tile1_5 tile1_6) (is-down tile1_5 tile1_4) (is-right tile1_6 tile2_6) (is-left tile1_6 tile0_6) (is-up tile1_6 tile1_7) (is-down tile1_6 tile1_5) (is-right tile1_7 tile2_7) (is-down tile1_7 tile1_6) (is-right tile1_13 tile2_13) (is-up tile1_13 tile1_14) (is-right tile1_14 tile2_14) (is-up tile1_14 tile1_15) (is-down tile1_14 tile1_13) (is-right tile1_15 tile2_15) (is-left tile1_15 tile0_15) (is-up tile1_15 tile1_16) (is-down tile1_15 tile1_14) (is-right tile1_16 tile2_16) (is-left tile1_16 tile0_16) (is-up tile1_16 tile1_17) (is-down tile1_16 tile1_15) (is-right tile1_17 tile2_17) (is-up tile1_17 tile1_18) (is-down tile1_17 tile1_16) (is-right tile1_18 tile2_18) (is-down tile1_18 tile1_17) (is-left tile2_0 tile1_0) (is-up tile2_0 tile2_1) (is-left tile2_1 tile1_1) (is-up tile2_1 tile2_2) (is-down tile2_1 tile2_0) (is-left tile2_2 tile1_2) (is-up tile2_2 tile2_3) (is-down tile2_2 tile2_1) (is-left tile2_3 tile1_3) (is-up tile2_3 tile2_4) (is-down tile2_3 tile2_2) (is-left tile2_4 tile1_4) (is-up tile2_4 tile2_5) (is-down tile2_4 tile2_3) (is-left tile2_5 tile1_5) (is-up tile2_5 tile2_6) (is-down tile2_5 tile2_4) (is-right tile2_6 tile3_6) (is-left tile2_6 tile1_6) (is-up tile2_6 tile2_7) (is-down tile2_6 tile2_5) (is-right tile2_7 tile3_7) (is-left tile2_7 tile1_7) (is-down tile2_7 tile2_6) (is-right tile2_13 tile3_13) (is-left tile2_13 tile1_13) (is-up tile2_13 tile2_14) (is-right tile2_14 tile3_14) (is-left tile2_14 tile1_14) (is-up tile2_14 tile2_15) (is-down tile2_14 tile2_13) (is-left tile2_15 tile1_15) (is-up tile2_15 tile2_16) (is-down tile2_15 tile2_14) (is-left tile2_16 tile1_16) (is-up tile2_16 tile2_17) (is-down tile2_16 tile2_15) (is-right tile2_17 tile3_17) (is-left tile2_17 tile1_17) (is-up tile2_17 tile2_18) (is-down tile2_17 tile2_16) (is-right tile2_18 tile3_18) (is-left tile2_18 tile1_18) (is-down tile2_18 tile2_17) (is-right tile3_6 tile4_6) (is-left tile3_6 tile2_6) (is-up tile3_6 tile3_7) (is-right tile3_7 tile4_7) (is-left tile3_7 tile2_7) (is-up tile3_7 tile3_8) (is-down tile3_7 tile3_6) (is-right tile3_8 tile4_8) (is-up tile3_8 tile3_9) (is-down tile3_8 tile3_7) (is-right tile3_9 tile4_9) (is-up tile3_9 tile3_10) (is-down tile3_9 tile3_8) (is-right tile3_10 tile4_10) (is-up tile3_10 tile3_11) (is-down tile3_10 tile3_9) (is-right tile3_11 tile4_11) (is-up tile3_11 tile3_12) (is-down tile3_11 tile3_10) (is-right tile3_12 tile4_12) (is-up tile3_12 tile3_13) (is-down tile3_12 tile3_11) (is-right tile3_13 tile4_13) (is-left tile3_13 tile2_13) (is-up tile3_13 tile3_14) (is-down tile3_13 tile3_12) (is-right tile3_14 tile4_14) (is-left tile3_14 tile2_14) (is-down tile3_14 tile3_13) (is-right tile3_17 tile4_17) (is-left tile3_17 tile2_17) (is-up tile3_17 tile3_18) (is-right tile3_18 tile4_18) (is-left tile3_18 tile2_18) (is-down tile3_18 tile3_17) (is-right tile4_6 tile5_6) (is-left tile4_6 tile3_6) (is-up tile4_6 tile4_7) (is-right tile4_7 tile5_7) (is-left tile4_7 tile3_7) (is-up tile4_7 tile4_8) (is-down tile4_7 tile4_6) (is-left tile4_8 tile3_8) (is-up tile4_8 tile4_9) (is-down tile4_8 tile4_7) (is-left tile4_9 tile3_9) (is-up tile4_9 tile4_10) (is-down tile4_9 tile4_8) (is-left tile4_10 tile3_10) (is-up tile4_10 tile4_11) (is-down tile4_10 tile4_9) (is-left tile4_11 tile3_11) (is-up tile4_11 tile4_12) (is-down tile4_11 tile4_10) (is-left tile4_12 tile3_12) (is-up tile4_12 tile4_13) (is-down tile4_12 tile4_11) (is-right tile4_13 tile5_13) (is-left tile4_13 tile3_13) (is-up tile4_13 tile4_14) (is-down tile4_13 tile4_12) (is-right tile4_14 tile5_14) (is-left tile4_14 tile3_14) (is-down tile4_14 tile4_13) (is-right tile4_17 tile5_17) (is-left tile4_17 tile3_17) (is-up tile4_17 tile4_18) (is-right tile4_18 tile5_18) (is-left tile4_18 tile3_18) (is-down tile4_18 tile4_17) (is-right tile5_0 tile6_0) (is-up tile5_0 tile5_1) (is-right tile5_1 tile6_1) (is-up tile5_1 tile5_2) (is-down tile5_1 tile5_0) (is-right tile5_2 tile6_2) (is-up tile5_2 tile5_3) (is-down tile5_2 tile5_1) (is-right tile5_3 tile6_3) (is-up tile5_3 tile5_4) (is-down tile5_3 tile5_2) (is-right tile5_4 tile6_4) (is-up tile5_4 tile5_5) (is-down tile5_4 tile5_3) (is-right tile5_5 tile6_5) (is-up tile5_5 tile5_6) (is-down tile5_5 tile5_4) (is-right tile5_6 tile6_6) (is-left tile5_6 tile4_6) (is-up tile5_6 tile5_7) (is-down tile5_6 tile5_5) (is-right tile5_7 tile6_7) (is-left tile5_7 tile4_7) (is-down tile5_7 tile5_6) (is-right tile5_13 tile6_13) (is-left tile5_13 tile4_13) (is-up tile5_13 tile5_14) (is-right tile5_14 tile6_14) (is-left tile5_14 tile4_14) (is-up tile5_14 tile5_15) (is-down tile5_14 tile5_13) (is-right tile5_15 tile6_15) (is-up tile5_15 tile5_16) (is-down tile5_15 tile5_14) (is-right tile5_16 tile6_16) (is-up tile5_16 tile5_17) (is-down tile5_16 tile5_15) (is-right tile5_17 tile6_17) (is-left tile5_17 tile4_17) (is-up tile5_17 tile5_18) (is-down tile5_17 tile5_16) (is-right tile5_18 tile6_18) (is-left tile5_18 tile4_18) (is-up tile5_18 tile5_19) (is-down tile5_18 tile5_17) (is-right tile5_19 tile6_19) (is-down tile5_19 tile5_18) (is-left tile6_0 tile5_0) (is-up tile6_0 tile6_1) (is-right tile6_1 tile7_1) (is-left tile6_1 tile5_1) (is-up tile6_1 tile6_2) (is-down tile6_1 tile6_0) (is-right tile6_2 tile7_2) (is-left tile6_2 tile5_2) (is-up tile6_2 tile6_3) (is-down tile6_2 tile6_1) (is-left tile6_3 tile5_3) (is-up tile6_3 tile6_4) (is-down tile6_3 tile6_2) (is-left tile6_4 tile5_4) (is-up tile6_4 tile6_5) (is-down tile6_4 tile6_3) (is-left tile6_5 tile5_5) (is-up tile6_5 tile6_6) (is-down tile6_5 tile6_4) (is-right tile6_6 tile7_6) (is-left tile6_6 tile5_6) (is-up tile6_6 tile6_7) (is-down tile6_6 tile6_5) (is-right tile6_7 tile7_7) (is-left tile6_7 tile5_7) (is-down tile6_7 tile6_6) (is-left tile6_13 tile5_13) (is-up tile6_13 tile6_14) (is-left tile6_14 tile5_14) (is-up tile6_14 tile6_15) (is-down tile6_14 tile6_13) (is-right tile6_15 tile7_15) (is-left tile6_15 tile5_15) (is-up tile6_15 tile6_16) (is-down tile6_15 tile6_14) (is-right tile6_16 tile7_16) (is-left tile6_16 tile5_16) (is-up tile6_16 tile6_17) (is-down tile6_16 tile6_15) (is-left tile6_17 tile5_17) (is-up tile6_17 tile6_18) (is-down tile6_17 tile6_16) (is-left tile6_18 tile5_18) (is-up tile6_18 tile6_19) (is-down tile6_18 tile6_17) (is-left tile6_19 tile5_19) (is-down tile6_19 tile6_18) (is-right tile7_1 tile8_1) (is-left tile7_1 tile6_1) (is-up tile7_1 tile7_2) (is-right tile7_2 tile8_2) (is-left tile7_2 tile6_2) (is-down tile7_2 tile7_1) (is-right tile7_6 tile8_6) (is-left tile7_6 tile6_6) (is-up tile7_6 tile7_7) (is-right tile7_7 tile8_7) (is-left tile7_7 tile6_7) (is-down tile7_7 tile7_6) (is-right tile7_15 tile8_15) (is-left tile7_15 tile6_15) (is-up tile7_15 tile7_16) (is-right tile7_16 tile8_16) (is-left tile7_16 tile6_16) (is-down tile7_16 tile7_15) (is-right tile8_1 tile9_1) (is-left tile8_1 tile7_1) (is-up tile8_1 tile8_2) (is-right tile8_2 tile9_2) (is-left tile8_2 tile7_2) (is-down tile8_2 tile8_1) (is-right tile8_6 tile9_6) (is-left tile8_6 tile7_6) (is-up tile8_6 tile8_7) (is-right tile8_7 tile9_7) (is-left tile8_7 tile7_7) (is-down tile8_7 tile8_6) (is-right tile8_11 tile9_11) (is-up tile8_11 tile8_12) (is-right tile8_12 tile9_12) (is-up tile8_12 tile8_13) (is-down tile8_12 tile8_11) (is-right tile8_13 tile9_13) (is-up tile8_13 tile8_14) (is-down tile8_13 tile8_12) (is-right tile8_14 tile9_14) (is-up tile8_14 tile8_15) (is-down tile8_14 tile8_13) (is-right tile8_15 tile9_15) (is-left tile8_15 tile7_15) (is-up tile8_15 tile8_16) (is-down tile8_15 tile8_14) (is-right tile8_16 tile9_16) (is-left tile8_16 tile7_16) (is-down tile8_16 tile8_15) (is-right tile9_1 tile10_1) (is-left tile9_1 tile8_1) (is-up tile9_1 tile9_2) (is-right tile9_2 tile10_2) (is-left tile9_2 tile8_2) (is-down tile9_2 tile9_1) (is-right tile9_6 tile10_6) (is-left tile9_6 tile8_6) (is-up tile9_6 tile9_7) (is-right tile9_7 tile10_7) (is-left tile9_7 tile8_7) (is-up tile9_7 tile9_8) (is-down tile9_7 tile9_6) (is-right tile9_8 tile10_8) (is-up tile9_8 tile9_9) (is-down tile9_8 tile9_7) (is-right tile9_9 tile10_9) (is-up tile9_9 tile9_10) (is-down tile9_9 tile9_8) (is-right tile9_10 tile10_10) (is-up tile9_10 tile9_11) (is-down tile9_10 tile9_9) (is-right tile9_11 tile10_11) (is-left tile9_11 tile8_11) (is-up tile9_11 tile9_12) (is-down tile9_11 tile9_10) (is-right tile9_12 tile10_12) (is-left tile9_12 tile8_12) (is-up tile9_12 tile9_13) (is-down tile9_12 tile9_11) (is-left tile9_13 tile8_13) (is-up tile9_13 tile9_14) (is-down tile9_13 tile9_12) (is-left tile9_14 tile8_14) (is-up tile9_14 tile9_15) (is-down tile9_14 tile9_13) (is-right tile9_15 tile10_15) (is-left tile9_15 tile8_15) (is-up tile9_15 tile9_16) (is-down tile9_15 tile9_14) (is-right tile9_16 tile10_16) (is-left tile9_16 tile8_16) (is-down tile9_16 tile9_15) (is-right tile10_1 tile11_1) (is-left tile10_1 tile9_1) (is-up tile10_1 tile10_2) (is-right tile10_2 tile11_2) (is-left tile10_2 tile9_2) (is-down tile10_2 tile10_1) (is-right tile10_6 tile11_6) (is-left tile10_6 tile9_6) (is-up tile10_6 tile10_7) (is-right tile10_7 tile11_7) (is-left tile10_7 tile9_7) (is-up tile10_7 tile10_8) (is-down tile10_7 tile10_6) (is-left tile10_8 tile9_8) (is-up tile10_8 tile10_9) (is-down tile10_8 tile10_7) (is-left tile10_9 tile9_9) (is-up tile10_9 tile10_10) (is-down tile10_9 tile10_8) (is-left tile10_10 tile9_10) (is-up tile10_10 tile10_11) (is-down tile10_10 tile10_9) (is-right tile10_11 tile11_11) (is-left tile10_11 tile9_11) (is-up tile10_11 tile10_12) (is-down tile10_11 tile10_10) (is-right tile10_12 tile11_12) (is-left tile10_12 tile9_12) (is-down tile10_12 tile10_11) (is-right tile10_15 tile11_15) (is-left tile10_15 tile9_15) (is-up tile10_15 tile10_16) (is-right tile10_16 tile11_16) (is-left tile10_16 tile9_16) (is-up tile10_16 tile10_17) (is-down tile10_16 tile10_15) (is-right tile10_17 tile11_17) (is-up tile10_17 tile10_18) (is-down tile10_17 tile10_16) (is-right tile10_18 tile11_18) (is-up tile10_18 tile10_19) (is-down tile10_18 tile10_17) (is-right tile10_19 tile11_19) (is-down tile10_19 tile10_18) (is-right tile11_0 tile12_0) (is-up tile11_0 tile11_1) (is-right tile11_1 tile12_1) (is-left tile11_1 tile10_1) (is-up tile11_1 tile11_2) (is-down tile11_1 tile11_0) (is-right tile11_2 tile12_2) (is-left tile11_2 tile10_2) (is-up tile11_2 tile11_3) (is-down tile11_2 tile11_1) (is-right tile11_3 tile12_3) (is-up tile11_3 tile11_4) (is-down tile11_3 tile11_2) (is-right tile11_4 tile12_4) (is-up tile11_4 tile11_5) (is-down tile11_4 tile11_3) (is-right tile11_5 tile12_5) (is-up tile11_5 tile11_6) (is-down tile11_5 tile11_4) (is-right tile11_6 tile12_6) (is-left tile11_6 tile10_6) (is-up tile11_6 tile11_7) (is-down tile11_6 tile11_5) (is-right tile11_7 tile12_7) (is-left tile11_7 tile10_7) (is-down tile11_7 tile11_6) (is-right tile11_11 tile12_11) (is-left tile11_11 tile10_11) (is-up tile11_11 tile11_12) (is-right tile11_12 tile12_12) (is-left tile11_12 tile10_12) (is-down tile11_12 tile11_11) (is-left tile11_15 tile10_15) (is-up tile11_15 tile11_16) (is-left tile11_16 tile10_16) (is-up tile11_16 tile11_17) (is-down tile11_16 tile11_15) (is-right tile11_17 tile12_17) (is-left tile11_17 tile10_17) (is-up tile11_17 tile11_18) (is-down tile11_17 tile11_16) (is-right tile11_18 tile12_18) (is-left tile11_18 tile10_18) (is-up tile11_18 tile11_19) (is-down tile11_18 tile11_17) (is-left tile11_19 tile10_19) (is-down tile11_19 tile11_18) (is-left tile12_0 tile11_0) (is-up tile12_0 tile12_1) (is-left tile12_1 tile11_1) (is-up tile12_1 tile12_2) (is-down tile12_1 tile12_0) (is-left tile12_2 tile11_2) (is-up tile12_2 tile12_3) (is-down tile12_2 tile12_1) (is-right tile12_3 tile13_3) (is-left tile12_3 tile11_3) (is-up tile12_3 tile12_4) (is-down tile12_3 tile12_2) (is-right tile12_4 tile13_4) (is-left tile12_4 tile11_4) (is-up tile12_4 tile12_5) (is-down tile12_4 tile12_3) (is-left tile12_5 tile11_5) (is-up tile12_5 tile12_6) (is-down tile12_5 tile12_4) (is-left tile12_6 tile11_6) (is-up tile12_6 tile12_7) (is-down tile12_6 tile12_5) (is-left tile12_7 tile11_7) (is-down tile12_7 tile12_6) (is-right tile12_11 tile13_11) (is-left tile12_11 tile11_11) (is-up tile12_11 tile12_12) (is-right tile12_12 tile13_12) (is-left tile12_12 tile11_12) (is-down tile12_12 tile12_11) (is-right tile12_17 tile13_17) (is-left tile12_17 tile11_17) (is-up tile12_17 tile12_18) (is-right tile12_18 tile13_18) (is-left tile12_18 tile11_18) (is-down tile12_18 tile12_17) (is-right tile13_3 tile14_3) (is-left tile13_3 tile12_3) (is-up tile13_3 tile13_4) (is-right tile13_4 tile14_4) (is-left tile13_4 tile12_4) (is-down tile13_4 tile13_3) (is-right tile13_11 tile14_11) (is-left tile13_11 tile12_11) (is-up tile13_11 tile13_12) (is-right tile13_12 tile14_12) (is-left tile13_12 tile12_12) (is-down tile13_12 tile13_11) (is-right tile13_17 tile14_17) (is-left tile13_17 tile12_17) (is-up tile13_17 tile13_18) (is-right tile13_18 tile14_18) (is-left tile13_18 tile12_18) (is-down tile13_18 tile13_17) (is-right tile14_3 tile15_3) (is-left tile14_3 tile13_3) (is-up tile14_3 tile14_4) (is-right tile14_4 tile15_4) (is-left tile14_4 tile13_4) (is-down tile14_4 tile14_3) (is-right tile14_11 tile15_11) (is-left tile14_11 tile13_11) (is-up tile14_11 tile14_12) (is-right tile14_12 tile15_12) (is-left tile14_12 tile13_12) (is-down tile14_12 tile14_11) (is-right tile14_17 tile15_17) (is-left tile14_17 tile13_17) (is-up tile14_17 tile14_18) (is-right tile14_18 tile15_18) (is-left tile14_18 tile13_18) (is-down tile14_18 tile14_17) (is-right tile15_0 tile16_0) (is-up tile15_0 tile15_1) (is-right tile15_1 tile16_1) (is-up tile15_1 tile15_2) (is-down tile15_1 tile15_0) (is-right tile15_2 tile16_2) (is-up tile15_2 tile15_3) (is-down tile15_2 tile15_1) (is-right tile15_3 tile16_3) (is-left tile15_3 tile14_3) (is-up tile15_3 tile15_4) (is-down tile15_3 tile15_2) (is-right tile15_4 tile16_4) (is-left tile15_4 tile14_4) (is-up tile15_4 tile15_5) (is-down tile15_4 tile15_3) (is-right tile15_5 tile16_5) (is-up tile15_5 tile15_6) (is-down tile15_5 tile15_4) (is-right tile15_6 tile16_6) (is-up tile15_6 tile15_7) (is-down tile15_6 tile15_5) (is-right tile15_7 tile16_7) (is-up tile15_7 tile15_8) (is-down tile15_7 tile15_6) (is-right tile15_8 tile16_8) (is-up tile15_8 tile15_9) (is-down tile15_8 tile15_7) (is-right tile15_9 tile16_9) (is-up tile15_9 tile15_10) (is-down tile15_9 tile15_8) (is-right tile15_10 tile16_10) (is-up tile15_10 tile15_11) (is-down tile15_10 tile15_9) (is-right tile15_11 tile16_11) (is-left tile15_11 tile14_11) (is-up tile15_11 tile15_12) (is-down tile15_11 tile15_10) (is-right tile15_12 tile16_12) (is-left tile15_12 tile14_12) (is-up tile15_12 tile15_13) (is-down tile15_12 tile15_11) (is-right tile15_13 tile16_13) (is-up tile15_13 tile15_14) (is-down tile15_13 tile15_12) (is-right tile15_14 tile16_14) (is-up tile15_14 tile15_15) (is-down tile15_14 tile15_13) (is-right tile15_15 tile16_15) (is-up tile15_15 tile15_16) (is-down tile15_15 tile15_14) (is-right tile15_16 tile16_16) (is-up tile15_16 tile15_17) (is-down tile15_16 tile15_15) (is-right tile15_17 tile16_17) (is-left tile15_17 tile14_17) (is-up tile15_17 tile15_18) (is-down tile15_17 tile15_16) (is-right tile15_18 tile16_18) (is-left tile15_18 tile14_18) (is-up tile15_18 tile15_19) (is-down tile15_18 tile15_17) (is-right tile15_19 tile16_19) (is-down tile15_19 tile15_18) (is-left tile16_0 tile15_0) (is-up tile16_0 tile16_1) (is-left tile16_1 tile15_1) (is-up tile16_1 tile16_2) (is-down tile16_1 tile16_0) (is-right tile16_2 tile17_2) (is-left tile16_2 tile15_2) (is-up tile16_2 tile16_3) (is-down tile16_2 tile16_1) (is-right tile16_3 tile17_3) (is-left tile16_3 tile15_3) (is-up tile16_3 tile16_4) (is-down tile16_3 tile16_2) (is-left tile16_4 tile15_4) (is-up tile16_4 tile16_5) (is-down tile16_4 tile16_3) (is-left tile16_5 tile15_5) (is-up tile16_5 tile16_6) (is-down tile16_5 tile16_4) (is-left tile16_6 tile15_6) (is-up tile16_6 tile16_7) (is-down tile16_6 tile16_5) (is-left tile16_7 tile15_7) (is-up tile16_7 tile16_8) (is-down tile16_7 tile16_6) (is-right tile16_8 tile17_8) (is-left tile16_8 tile15_8) (is-up tile16_8 tile16_9) (is-down tile16_8 tile16_7) (is-right tile16_9 tile17_9) (is-left tile16_9 tile15_9) (is-up tile16_9 tile16_10) (is-down tile16_9 tile16_8) (is-left tile16_10 tile15_10) (is-up tile16_10 tile16_11) (is-down tile16_10 tile16_9) (is-left tile16_11 tile15_11) (is-up tile16_11 tile16_12) (is-down tile16_11 tile16_10) (is-left tile16_12 tile15_12) (is-up tile16_12 tile16_13) (is-down tile16_12 tile16_11) (is-left tile16_13 tile15_13) (is-up tile16_13 tile16_14) (is-down tile16_13 tile16_12) (is-right tile16_14 tile17_14) (is-left tile16_14 tile15_14) (is-up tile16_14 tile16_15) (is-down tile16_14 tile16_13) (is-right tile16_15 tile17_15) (is-left tile16_15 tile15_15) (is-up tile16_15 tile16_16) (is-down tile16_15 tile16_14) (is-left tile16_16 tile15_16) (is-up tile16_16 tile16_17) (is-down tile16_16 tile16_15) (is-left tile16_17 tile15_17) (is-up tile16_17 tile16_18) (is-down tile16_17 tile16_16) (is-left tile16_18 tile15_18) (is-up tile16_18 tile16_19) (is-down tile16_18 tile16_17) (is-left tile16_19 tile15_19) (is-down tile16_19 tile16_18) (is-right tile17_2 tile18_2) (is-left tile17_2 tile16_2) (is-up tile17_2 tile17_3) (is-right tile17_3 tile18_3) (is-left tile17_3 tile16_3) (is-down tile17_3 tile17_2) (is-right tile17_8 tile18_8) (is-left tile17_8 tile16_8) (is-up tile17_8 tile17_9) (is-right tile17_9 tile18_9) (is-left tile17_9 tile16_9) (is-down tile17_9 tile17_8) (is-right tile17_14 tile18_14) (is-left tile17_14 tile16_14) (is-up tile17_14 tile17_15) (is-right tile17_15 tile18_15) (is-left tile17_15 tile16_15) (is-down tile17_15 tile17_14) (is-right tile18_2 tile19_2) (is-left tile18_2 tile17_2) (is-up tile18_2 tile18_3) (is-right tile18_3 tile19_3) (is-left tile18_3 tile17_3) (is-down tile18_3 tile18_2) (is-right tile18_8 tile19_8) (is-left tile18_8 tile17_8) (is-up tile18_8 tile18_9) (is-right tile18_9 tile19_9) (is-left tile18_9 tile17_9) (is-down tile18_9 tile18_8) (is-right tile18_14 tile19_14) (is-left tile18_14 tile17_14) (is-up tile18_14 tile18_15) (is-right tile18_15 tile19_15) (is-left tile18_15 tile17_15) (is-down tile18_15 tile18_14) (is-left tile19_2 tile18_2) (is-up tile19_2 tile19_3) (is-left tile19_3 tile18_3) (is-down tile19_3 tile19_2) (is-left tile19_8 tile18_8) (is-up tile19_8 tile19_9) (is-left tile19_9 tile18_9) (is-down tile19_9 tile19_8) (is-left tile19_14 tile18_14) (is-up tile19_14 tile19_15) (is-left tile19_15 tile18_15) (is-down tile19_15 tile19_14) (on tile18_2))
    (:goal (and (holding p2366)))
)
