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

    task = JSON.parse(IOBuffer(msg))
    solver_name = task["train"]["solver"]
    prob_name = task["train"]["problem"]

    run_result = redirect_stdout(stderr) do
        TrainingGround.run(prob_name, solver_name)
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
