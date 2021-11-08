module TrainingGround

using TimeZones

using SimpleOne.Solvers:allsolvers
using SimpleOne:problem
using SimpleOne:problem_template
using SimpleOne:allproblems
using SimpleOne:profess
using SimpleOne:train
using SimpleOne.Problems:solvable

function train_model(prob_name, solver_name)
    prob = problem(prob_name)

    return _train_model(prob, solver_name)
end

# JSON objects to keyword arguments
fix_params(params) = params
fix_params(params::Dict{String,Any}) = Dict(Symbol(k) => v for (k, v) = params)

function train_template_model(template, params, solver_name)
    t = problem_template(template)
    params = fix_params(params)
    prob = t(; params...)

    return _train_model(prob, solver_name)
end

function _train_model(prob, solver_name)
    solver = allsolvers[solver_name]

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
                problem = prob.name,
                solver = solver_name,
                known_solution = known_solution,
                started = string(started),
                train_time_millis = (completed - started).value,
                total_prices = train_result.total_prices,
                p_value = test_result.p_value,
                confirm = test_result.confirm,
                sample_runs = test_result.sample_runs,
            ),
        )
    catch e
        @error "Training failure" exception = (e, catch_backtrace())

        return (
            failure = (
                message = pretty_message(e),
                problem = prob.name,
                solver = solver_name,
                known_solution = known_solution,
                started = string(started),
            ),
        )
    end
end

pretty_message(e::ErrorException) = e.msg

function pretty_message(e::Exception)
    s = string(e)  # can be very long
    if length(s) > 80
        return first(s, 59) * "..." * last(s, 19)
    else
        return s
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
