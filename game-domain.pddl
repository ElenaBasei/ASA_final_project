;; domani file: game-domain.pddl

(define (domain default)
    (:requirements :strips)
    (:predicates 
        (is-tile ?t) (is-delivery-tile ?t) (is-up ?t1 ?t2) (is-right ?t1 ?t2) (is-down ?t1 ?t2 ) (is-left ?t1 ?t2) (is-pack ?p) (pack-in ?p ?t ) (is-carried ?p) (on ?t) (holding ?p) (free)
    )
    (:action pick-up
        :parameters     (?p ?t)
        :precondition   (and (is-tile ?t) (is-pack ?p) (not (is-carried ?p)) (on ?t) (pack-in ?p ?t))
        :effect         (and (holding ?p) (is-carried ?p) (not (pack-in ?p ?t)) (not (free)))
    )
    (:action put-down
        :parameters     (?t)
        :precondition   (and (is-tile ?t) (is-delivery-tile ?t) (on ?t) (not (free)))
        :effect         (and (free))
    )
    (:action move-up
        :parameters     (?t1 ?t2)
        :precondition   (and (is-tile ?t1) (is-tile ?t2) (is-up ?t1 ?t2) (on ?t1))
        :effect         (and (not (on ?t1)) (on ?t2))
    )
    (:action move-right
        :parameters     (?t1 ?t2)
        :precondition   (and (is-tile ?t1) (is-tile ?t2) (is-right ?t1 ?t2) (on ?t1))
        :effect         (and (not (on ?t1)) (on ?t2))
    )
    (:action move-down
        :parameters     (?t1 ?t2)
        :precondition   (and (is-tile ?t1) (is-tile ?t2) (is-down ?t1 ?t2) (on ?t1))
        :effect         (and (not (on ?t1)) (on ?t2))
    )
    (:action move-left
        :parameters     (?t1 ?t2)
        :precondition   (and (is-tile ?t1) (is-tile ?t2) (is-left ?t1 ?t2) (on ?t1))
        :effect         (and (not (on ?t1)) (on ?t2))
    )
)