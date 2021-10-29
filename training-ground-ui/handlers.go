package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"cloud.google.com/go/bigquery"
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

type RunDetails struct {
	Price   float64              `json:"price"`
	Signal  bigquery.NullFloat64 `json:"-"`
	Signal2 *float64             `json:"signal"`
	Action  string               `json:"action"`
	Pnl     float64              `json:"pnl"`
}

type SampleRun struct {
	Problem string       `json:"problem"`
	Solver  string       `json:"solver"`
	Started time.Time    `json:"started"`
	Details []RunDetails `json:"details"`
}

func trainingSummary(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	q := bq.Connect(ctx).Query("call M1.GetTrainingSummary()")

	it, err := q.Read(ctx)
	if err != nil {
		writeError(w, err)
		return
	}

	xs := []RunSummary{}
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

func sampleRuns(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	params := r.URL.Query()
	problem := params.Get("problem")
	if problem == "" {
		writeError(w, errors.New("problem= parameter required"))
		return
	}

	solver := params.Get("solver")
	if solver == "" {
		writeError(w, errors.New("solver= parameter required"))
		return
	}

	q := bq.Connect(ctx).Query("call M1.GetSampleRuns(@problem, @solver)")
	q.Parameters = []bigquery.QueryParameter{
		{Name: "problem", Value: problem},
		{Name: "solver", Value: solver},
	}

	it, err := q.Read(ctx)
	if err != nil {
		writeError(w, err)
		return
	}

	xs := []SampleRun{}
	for {
		var x SampleRun
		err := it.Next(&x)
		if err == iterator.Done {
			break
		}

		for i := range x.Details {
			if x.Details[i].Signal.Valid {
				x.Details[i].Signal2 = &x.Details[i].Signal.Float64
			} else {
				x.Details[i].Signal2 = nil
			}
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
