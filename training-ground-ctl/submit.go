package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	cloud "github.com/PurTech/medea-cloud-go"
	"github.com/PurTech/medea-cloud-go/ct"
	"github.com/PurTech/medea-cloud-go/run"
)

const (
	trainingRegion    = "us-east1"
	trainingService   = "training-ground"
	trainingQueue     = "m1-training-tasks"
	trainingSinkTopic = "egress--training-ground--training-ground"
)

type SubmitTasks struct {
	Solvers     []string `json:"solvers"`
	SolverList  string   `json:"solverlist"`
	Problems    []string `json:"problems"`
	ProblemList string   `json:"problemlist"`
}

type TrainModel struct {
	Problem string `json:"problem"`
	Solver  string `json:"solver"`
}

func submitTasks(ctx context.Context, spec *SubmitTasks) error {
	if len(spec.Solvers) > 0 && spec.SolverList != "" {
		return fmt.Errorf("'solvers' and 'solverlist' properties are mutually exclusive")
	}

	if len(spec.Problems) > 0 && spec.ProblemList != "" {
		return fmt.Errorf("'problems' and 'problemlist' properties are mutually exclusive")
	}

	solvers := spec.Solvers
	if len(solvers) == 0 {
		var err error
		solvers, err = resolveSolverList(ctx, spec.SolverList)
		if err != nil {
			return fmt.Errorf("error resolving the list of solvers: %s", err)
		}
	}

	problems := spec.Problems
	if len(problems) == 0 {
		var err error
		problems, err = resolveProblemList(ctx, spec.ProblemList)
		if err != nil {
			return fmt.Errorf("error resolving the list of problems: %s", err)
		}
	}

	log.Printf("Solvers: %v", solvers)
	log.Printf("Problems: %v", problems)

	err := ensureOutputTablesExists(ctx)
	if err != nil {
		return fmt.Errorf("cannot create the output table: %s", err)
	}

	log.Printf("Output tables OK")

	count := 0
	for _, prob := range problems {
		for _, solver := range solvers {
			x := struct {
				TrainModel TrainModel `json:"train-model"`
			}{TrainModel{prob, solver}}

			payload, err := json.Marshal(&x)
			if err != nil {
				panic(err)
			}

			targetURL := cloud.GetServiceURL(trainingService)
			targetURL += "/1/go?output=" + trainingSinkTopic

			_, err = ct.SubmitTaskWithURL(ctx, trainingRegion, trainingQueue, targetURL, []byte(payload), nil)
			if err != nil {
				return err
			}

			count++

			// if count >= 3 {
			// 	break //DBG
			// }
		}

		// if count >= 3 {
		// 	break //DBG
		// }
	}

	log.Printf("%d task(s) submitted to %s queue", count, trainingQueue)
	return nil
}

func resolveSolverList(ctx context.Context, solverList string) ([]string, error) {
	input := struct {
		ResolveSolverList string `json:"resolve-solver-list"`
	}{solverList}

	output := struct {
		Solvers []string `json:"solvers"`
	}{}

	err := run.CallService(ctx, "training-ground", &input, &output)
	if err != nil {
		return nil, err
	}

	return output.Solvers, nil
}

func resolveProblemList(ctx context.Context, problemList string) ([]string, error) {
	input := struct {
		ResolveProblemList string `json:"resolve-problem-list"`
	}{problemList}

	output := struct {
		Problems []string `json:"problems"`
	}{}

	err := run.CallService(ctx, "training-ground", &input, &output)
	if err != nil {
		return nil, err
	}

	return output.Problems, nil
}

// func submitTasks1(ctx context.Context, problems []string, solvers []string) error {
// 	//TODO
// 	//TODO
// 	//TODO
// 	return nil
// }
