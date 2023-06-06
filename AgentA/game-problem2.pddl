;; problem file: game-problem2.pddl

(define (problem game-prob2)
    (:domain game)
    (:objects 
        p - pack 
        tile0_0 - tile tile0_1 - tile tile0_2 - tile tile0_3 - tile
        tile1_0 - tile tile1_1 - tile tile1_2 - tile tile1_3 - tile
        tile2_0 - tile tile2_1 - tile tile2_2 - tile tile2_3 - tile
        tile3_0 - tile tile3_1 - tile tile3_2 - tile tile3_3 - tile
    )
    (:init
        (is-tile tile0_0) (is-tile tile0_1) (is-tile tile0_2) (is-tile tile0_3)
        (is-tile tile1_0) (is-tile tile1_1) (is-tile tile1_2) (is-tile tile1_3)
        (is-tile tile2_0) (is-tile tile2_1) (is-tile tile2_2) (is-tile tile2_3)
        (is-tile tile3_0) (is-tile tile3_1) (is-tile tile3_2) (is-tile tile3_3)
        (is-up tile0_0 tile1_0) (is-up tile0_1 tile1_1) (is-up tile0_3 tile1_3)
        (is-up tile1_0 tile2_0) (is-up tile1_3 tile2_3)
        (is-up tile2_0 tile3_0) (is-up tile2_2 tile3_2)
        (is-right tile0_0 tile0_1) (is-right tile0_1 tile0_2) (is-right tile0_2 tile0_3)
        (is-right tile1_0 tile1_1)
        (is-right tile2_2 tile2_3)
        (is-right tile3_0 tile3_1) (is-right tile3_1 tile3_2)
        (is-down tile1_0 tile0_0) (is-down tile1_1 tile0_1) (is-down tile1_3 tile0_3)
        (is-down tile2_0 tile1_0) (is-down tile2_3 tile1_3)
        (is-down tile3_0 tile2_0) (is-down tile3_2 tile2_2)
        (is-left tile0_1 tile0_0) (is-left tile0_2 tile0_1) (is-left tile0_3 tile0_2)
        (is-left tile1_1 tile1_0)
        (is-left tile2_3 tile2_2)
        (is-left tile3_1 tile3_0) (is-left tile3_2 tile3_1)
        (is-delivery-tile tile3_0)
        (is-pack p) (on tile0_0) (pack-in p tile2_2) (free)
    )
    (:goal (and  (exists (?t - tile) (and (on ?t) (is-delivery-tile ?t)))))
)