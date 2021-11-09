package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	cloud "github.com/PurTech/medea-cloud-go"
	"github.com/PurTech/medea-cloud-go/ct"
)

const (
	trainingRegion    = "us-east1"
	trainingService   = "training-ground"
	trainingQueue     = "m1-training-tasks"
	trainingSinkTopic = "egress--training-ground-1--training-ground-1"
)

type ProblemTemplate struct {
	Template string                   `json:"template"`
	Params   []map[string]interface{} `json:"params"`
}

type SubmitTasks struct {
	Solvers   []string          `json:"solvers"`
	Templates []ProblemTemplate `json:"templates"`
}

type TrainTemplateModel struct {
	Template string                 `json:"template"`
	Params   map[string]interface{} `json:"params"`
	Solver   string                 `json:"solver"`
}

func submitTasks(ctx context.Context, spec *SubmitTasks) error {
	err := ensureOutputTablesExists(ctx)
	if err != nil {
		return fmt.Errorf("cannot create the output table: %s", err)
	}

	log.Printf("%s and %s output tables OK", reportsTableName, runsTableName)

	count := 0
	for _, solver := range spec.Solvers {
		for _, t := range spec.Templates {
			for _, params := range t.Params {

				x := struct {
					TrainTemplateModel TrainTemplateModel `json:"train-template-model"`
				}{TrainTemplateModel{t.Template, params, solver}}

				payload, err := json.Marshal(&x)
				if err != nil {
					panic(err)
				}

				targetURL := cloud.GetServiceURL(trainingService)
				targetURL += "/1/go?output=" + trainingSinkTopic

				//fmt.Println(string(payload))
				_, err = ct.SubmitTaskWithURL(ctx, trainingRegion, trainingQueue, targetURL, payload, nil)
				if err != nil {
					return err
				}

				count++
			}
		}
	}

	log.Printf("%d task(s) submitted to %s queue", count, trainingQueue)
	return nil
}
