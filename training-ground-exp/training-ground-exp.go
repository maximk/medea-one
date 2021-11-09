package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
)

type Request struct {
	SubmitTasks *SubmitTasks `json:"submit-tasks"`
	Success     *Success     `json:"success"`
	Failure     *Failure     `json:"failure"`
}

func main() {
	log.SetFlags(0)
	ctx := context.Background()

	r := bufio.NewReader(os.Stdin)
loop:
	for {
		var err error
		var aid string
		l, err := r.ReadString('\n')
		if err == io.EOF {
			break loop
		}
		if err != nil {
			panic(err)
		}

		l = strings.TrimSuffix(l, "\n")
		if strings.Contains(l, " ") {
			x := strings.SplitN(l, " ", 2)
			l = x[0]
			aid = x[1]
		}

		sz, err := strconv.ParseInt(l, 10, 32)
		if err != nil {
			panic(err)
		}

		msg := make([]byte, sz)
		_, err = io.ReadFull(r, msg)
		if err != nil {
			panic(err)
		}

		r.ReadByte() // extra newline

		//-----------------------------------------------------------------------
		_ = aid

		outputs := [][]byte{}

		var req *Request
		err = json.Unmarshal(msg, &req)
		if err != nil {
			panic(err)
		}

		if req.SubmitTasks != nil {
			err = submitTasks(ctx, req.SubmitTasks)
		} else if req.Success != nil {
			err = recordSuccess(ctx, req.Success)
		} else if req.Failure != nil {
			err = recordFailure(ctx, req.Failure)
		} else {
			err = fmt.Errorf("request not recognized: %s", msg)
		}

		if err != nil {
			log.Fatalf("Error: %s", err)
		}
		//-----------------------------------------------------------------------

		outputs = append(outputs, []byte("$$$$"))
		for _, out := range outputs {
			fmt.Printf("%d\n", len(out))

			_, err = os.Stdout.Write(out)
			if err != nil {
				panic(err)
			}

			fmt.Print("\n")
		}
	}
}
