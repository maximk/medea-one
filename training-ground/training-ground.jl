#!/usr/bin/env julia

using Pkg
redirect_stdout(stderr) do
    Pkg.activate(".")
end

using JSON
using TrainingGround

while true
    aid = ""
    
    headerline = readline(stdin, keep = true)
    if headerline == ""
        error("EOF")
    end
    ## size [ SP aid ] NL
    headerline = chomp(headerline)
    if occursin(" ", headerline)
        x = split(headerline, " ", limit = 2)
        size = parse(Int, x[1])
        aid = x[2]
    else
        size = parse(Int, headerline)
        aid = ""
    end
    msg = Vector{UInt8}(undef, size)
    readbytes!(stdin, msg, size)
    read(stdin, Char) ## extra newline
    
    ##---------------------------------------------------------------------------
    
    outputs = Vector{UInt8}[]

    run_result = redirect_stdout(stderr) do
        req = JSON.parse(IOBuffer(msg))
        if haskey(req, "train-model")
            args = req["train-model"]
            TrainingGround.train_model(args["problem"], args["solver"])
        elseif haskey(req, "train-template-model")
            args = req["train-template-model"]
            TrainingGround.train_template_model(args["template"], args["params"], args["solver"])
        elseif haskey(req, "resolve-solver-list")
            args = req["resolve-solver-list"]
            TrainingGround.resolve_solver_list(args)
        elseif haskey(req, "resolve-problem-list")
            args = req["resolve-problem-list"]
            TrainingGround.resolve_problem_list(args)
        else
            Dict(:error => "action not supported; use 'train-model', 'train-template-model', 'resolve-solver-list', or 'resolve-problem-list'")
        end
    end

    output = Vector{UInt8}(JSON.json(run_result))
    push!(outputs, output)

    ##---------------------------------------------------------------------------

    push!(outputs, b"$$$$")
    for o = outputs
        write(stdout, string(length(o)))
        write(stdout, "\n")
        write(stdout, o)
        write(stdout, "\n")    
    end
end
