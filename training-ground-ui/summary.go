package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/PurTech/medea-cloud-go/bq"
	"google.golang.org/api/iterator"
)

type RunSummary struct {
	Problem      string `json:"p"`
	Solver       string `json:"s"`
	NumErrors    int    `json:"ne"`
	NumSolved    int    `json:"ns"`
	NumNotSolved int    `json:"nu"`
}

func trainingSummary(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	q := bq.Connect(ctx).Query(`
declare AllSolvers array<string>;
declare AllProblems array<string>;

set AllSolvers = array(select Solver from M1.TrainingReports group by Solver);
set AllProblems = array(select Problem from M1.TrainingReports group by Problem);

with ProblemSolvers as (
	select Problem, Solver from unnest(AllProblems) as Problem, unnest(AllSolvers) as Solver
),

RecentReports as (
	select *
	from M1.TrainingReports
	where true
	qualify row_number() over (partition by Problem, Solver order by Started desc) <= 16
)

select Problem, Solver,
		sum(if(ErrorMsg is not null, 1, 0)) as NumErrors,
		sum(if(Confirm, 1, 0)) as NumSolved,
		sum(if(not Confirm, 1, 0)) as NumNotSolved,
	from ProblemSolvers left join RecentReports using (Problem, Solver)
	group by Problem, Solver
`)

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
