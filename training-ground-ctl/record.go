package main

import (
	"context"
	"log"
	"time"

	"cloud.google.com/go/bigquery"
	"github.com/PurTech/medea-cloud-go/bq"
)

const reportsTableName = "TrainingReports"
const runsTableName = "SampleRuns"

const timeLayout = "2006-01-02T15:04:05.999"

type RunDetails struct {
	Price  float64  `json:"price"`
	Signal *float64 `json:"signal"`
	Action string   `json:"action"`
	Pnl    float64  `json:"pnl"`
}

type Success struct {
	Problem         string         `json:"problem"`
	Solver          string         `json:"solver"`
	KnownSolution   bool           `json:"known_solution"`
	Started         string         `json:"started"`
	TrainTimeMillis int64          `json:"train_time_millis"`
	TotalPrices     int64          `json:"total_prices"`
	PValue          float64        `json:"p_value"`
	Confirm         bool           `json:"confirm"`
	SampleRuns      [][]RunDetails `json:"sample_runs"`
}

type Failure struct {
	Message       string `json:"message"`
	Problem       string `json:"problem"`
	Solver        string `json:"solver"`
	KnownSolution bool   `json:"known_solution"`
	Started       string `json:"started"`
}

type TrainRep struct {
	Success         bool
	Problem         string
	Solver          string
	KnownSolution   bool
	Started         time.Time
	TrainTimeMillis bigquery.NullInt64
	TotalPrices     bigquery.NullInt64
	PValue          bigquery.NullFloat64
	Confirm         bigquery.NullBool
	ErrorMsg        bigquery.NullString
}

// A variant of RunDetails suitable for BigQuery
type RunDetails2 struct {
	Price  float64
	Signal bigquery.NullFloat64
	Action string
	Pnl    float64
}

type SampleRun struct {
	Problem string
	Solver  string
	Started time.Time
	Details []RunDetails2
}

func ensureOutputTablesExists(ctx context.Context) error {
	t := bq.Connect(ctx).Dataset("M1").Table(reportsTableName)
	if _, err := t.Metadata(ctx); err != nil {
		schema, err := bigquery.InferSchema(&TrainRep{})
		if err != nil {
			panic(err)
		}

		err = t.Create(ctx, &bigquery.TableMetadata{Schema: schema})
		if err != nil {
			return nil
		}
	}

	t = bq.Connect(ctx).Dataset("M1").Table(runsTableName)
	if _, err := t.Metadata(ctx); err != nil {
		schema, err := bigquery.InferSchema(&SampleRun{})
		if err != nil {
			panic(err)
		}

		err = t.Create(ctx, &bigquery.TableMetadata{Schema: schema})
		if err != nil {
			return nil
		}
	}

	return nil
}

func recordSuccess(ctx context.Context, result *Success) error {
	err := recordSampleRuns(ctx, result)
	if err != nil {
		return err
	}

	log.Printf("OK: %#v", result)

	started, err := time.Parse(timeLayout, result.Started)
	if err != nil {
		return err
	}

	rep := &TrainRep{
		Success:         true,
		Problem:         result.Problem,
		Solver:          result.Solver,
		KnownSolution:   result.KnownSolution,
		Started:         started,
		TrainTimeMillis: bigquery.NullInt64{Int64: result.TrainTimeMillis, Valid: true},
		TotalPrices:     bigquery.NullInt64{Int64: result.TotalPrices, Valid: true},
		PValue:          bigquery.NullFloat64{Float64: result.PValue, Valid: true},
		Confirm:         bigquery.NullBool{Bool: result.Confirm, Valid: true},
		ErrorMsg:        bigquery.NullString{StringVal: "", Valid: false},
	}

	t := bq.Connect(ctx).Dataset("M1").Table(reportsTableName)
	return t.Inserter().Put(ctx, []*TrainRep{rep})
}

func recordSampleRuns(ctx context.Context, result *Success) error {
	started, err := time.Parse(timeLayout, result.Started)
	if err != nil {
		return err
	}

	var runs []*SampleRun
	for _, details := range result.SampleRuns {
		// Take care of nullable signals
		var details2 []RunDetails2
		for _, d := range details {
			s := bigquery.NullFloat64{Valid: false}
			if d.Signal != nil {
				s = bigquery.NullFloat64{Float64: *d.Signal, Valid: true}
			}

			details2 = append(details2, RunDetails2{
				Price:  d.Price,
				Signal: s,
				Action: d.Action,
				Pnl:    d.Pnl,
			})
		}

		run := &SampleRun{
			Problem: result.Problem,
			Solver:  result.Solver,
			Started: started,
			Details: details2,
		}

		runs = append(runs, run)
	}

	t := bq.Connect(ctx).Dataset("M1").Table(runsTableName)
	return t.Inserter().Put(ctx, runs)
}

func recordFailure(ctx context.Context, result *Failure) error {
	log.Printf("FAIL: %#v", result)

	started, err := time.Parse(timeLayout, result.Started)
	if err != nil {
		return err
	}

	rep := &TrainRep{
		Success:         false,
		Problem:         result.Problem,
		Solver:          result.Solver,
		KnownSolution:   result.KnownSolution,
		Started:         started,
		TrainTimeMillis: bigquery.NullInt64{Int64: 0, Valid: false},
		TotalPrices:     bigquery.NullInt64{Int64: 0, Valid: false},
		PValue:          bigquery.NullFloat64{Float64: 0.0, Valid: false},
		Confirm:         bigquery.NullBool{Bool: false, Valid: false},
		ErrorMsg:        bigquery.NullString{StringVal: result.Message, Valid: true},
	}

	t := bq.Connect(ctx).Dataset("M1").Table(reportsTableName)
	return t.Inserter().Put(ctx, []*TrainRep{rep})
}
