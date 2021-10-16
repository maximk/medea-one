module TrainingGround

using TimeZones

using SimpleOne.Solvers:allsolvers
using SimpleOne:problem
using SimpleOne:profess
using SimpleOne:train
using SimpleOne.Problems:solvable

function run(prob_name, solver_name)

    solver = allsolvers[solver_name]
    prob = problem(prob_name)

    known_solution = nothing
    if solvable(prob)
        known_solution = profess(prob).confirm
    end

    started = TimeZones.now(TimeZones.UTC)

    try
        train_result = train(solver, prob)
        completed = TimeZones.now(TimeZones.UTC)
        
        test_result = profess(prob, train_result.solve)

        return (
            result = "ok",
            problem = prob_name,
            solver = solver_name,
            known_solution = known_solution,
            started = string(started),
            train_time_millis = (completed - started).value,
            total_prices = train_result.total_prices,
            p_value = test_result.p_value,
            confirm = test_result.confirm,
        )
    catch e
        @error "Training failure" exception = (e, catch_backtrace())

        return (
            error = string(e.msg),
            problem = prob_name,
            solver = solver_name,
            known_solution = known_solution,
            started = string(started),
        )
    end
end

end # module
