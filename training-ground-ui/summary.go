package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/PurTech/medea-cloud-go/bq"
	"google.golang.org/api/iterator"
)

type SolverSummary struct {
	Solver       string `json:"solver"`
	NumErrors    int    `json:"num_errors"`
	NumSolved    int    `json:"num_solved"`
	NumNotSolved int    `json:"num_unsolved"`
}

type RunSummary struct {
	Problem          string          `json:"problem"`
	NumKnownSolved   int             `json:"num_known_solved"`
	NumKnownUnsolved int             `json:"num_known_unsolved"`
	Results          []SolverSummary `json:"results"`
}

func trainingSummary(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	q := bq.Connect(ctx).Query("call M1.GetTrainingSummary()")

	it, err := q.Read(ctx)
	if err != nil {
		writeError(w, err)
		return
	}

	var xs []RunSummary
	for {
		var x RunSummary
		err := it.Next(&x)
		if err == iterator.Done {
			break
		}

		if err != nil {
			writeError(w, err)
			return
		}

		xs = append(xs, x)
	}

	payload, err := json.Marshal(xs)
	if err != nil {
		panic(err)
	}

	addCorsHeaders(w)
	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func addCorsHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
}

func writeError(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(fmt.Sprintf("Error: %s", err)))
}
