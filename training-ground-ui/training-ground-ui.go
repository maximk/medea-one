package main

import (
	"log"
	"net/http"
)

func main() {
	log.SetFlags(0)

	http.HandleFunc("/1/api/training/solvers", solverList)
	http.HandleFunc("/1/api/training/problems", problemList)
	http.HandleFunc("/1/api/training/stats", trainingStats)
	http.HandleFunc("/1/api/training/summary", trainingSummary)
	http.HandleFunc("/1/api/training/runs", trainingRuns)

	http.Handle("/", http.FileServer(http.Dir("build")))
	http.ListenAndServe(":8080", logRequest(http.DefaultServeMux))
}

func logRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s\n", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)
	})
}
