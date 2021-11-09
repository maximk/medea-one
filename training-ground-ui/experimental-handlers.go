package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"cloud.google.com/go/bigquery"
	"github.com/PurTech/medea-cloud-go/bq"
	"google.golang.org/api/iterator"
)

type ExpStats struct {
	ReportsReceived int `json:"reports_received"`
	SolutionsFound  int `json:"solutions_found"`
}

type ExpSummary struct {
	Problem         string `json:"problem"`
	Solver          string `json:"solver"`
	TrainTimeMillis int    `json:"train_time_ms"`
	TotalPrices     int    `json:"total_prices"`
}

func experimentalStats(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	q := bq.Connect(ctx).Query("call M1.GetExperimentalStats()")

	it, err := q.Read(ctx)
	if err != nil {
		writeError(w, err)
		return
	}

	x := ExpStats{}
	err = it.Next(&x)
	if err != nil {
		writeError(w, err)
		return
	}

	payload, err := json.Marshal(x)
	if err != nil {
		panic(err)
	}

	addCorsHeaders(w)
	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func experimentalSummary(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	q := bq.Connect(ctx).Query("call M1.GetExperimentalSummary()")

	it, err := q.Read(ctx)
	if err != nil {
		writeError(w, err)
		return
	}

	xs := []ExpSummary{}
	for {
		var x ExpSummary
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

func experimentalRuns(w http.ResponseWriter, r *http.Request) {
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

	q := bq.Connect(ctx).Query("call M1.GetExperimentalRuns(@problem, @solver)")
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
