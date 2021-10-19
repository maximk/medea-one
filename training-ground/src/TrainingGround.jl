module TrainingGround

using TimeZones

using SimpleOne.Solvers:allsolvers
using SimpleOne:problem
using SimpleOne:allproblems
using SimpleOne:profess
using SimpleOne:train
using SimpleOne.Problems:solvable

function train_model(prob_name, solver_name)

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
            success = (
                problem = prob_name,
                solver = solver_name,
                known_solution = known_solution,
                started = string(started),
                train_time_millis = (completed - started).value,
                total_prices = train_result.total_prices,
                p_value = test_result.p_value,
                confirm = test_result.confirm,
            ),
        )
    catch e
        @error "Training failure" exception = (e, catch_backtrace())

        return (
            failure = (
                message = string(e.msg),
                problem = prob_name,
                solver = solver_name,
                known_solution = known_solution,
                started = string(started),
            ),
        )
    end
end

function resolve_solver_list(list::String)
    if list == "ALL"
        return Dict(:solvers => keys(allsolvers))
    else
        return Dict(:error => "list $list not found")
    end
end

function resolve_problem_list(list::String)
    if list == "ALL"
        xs = (x.name for x = allproblems)
        return Dict(:problems => collect(xs))
    else
        return Dict(:error => "list $list not found")
    end
end

end # module
