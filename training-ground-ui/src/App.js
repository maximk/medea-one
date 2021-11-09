import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Dashboard from './components/Dashboard'
import RegularSummary from './components/RegularSummary'
import SampleRuns from './components/SampleRuns'
import ExperimentalSummary from './components/ExperimentalSummary'
import { useEffect, useState } from 'react'

import memoize from './cache'
import config from './config'
import ExperimentalRuns from './components/ExperimentalRuns'

function App() {
    const [allSolvers, setAllSolvers] = useState(undefined)

    useEffect(() => {
        const fetchSolvers = async () => {
            try {
                let url = config.apiUrl + 'training/solvers'
                if (memoize(url) === undefined) {
                    const response = await fetch(url)
                    const solvers = await response.json()
                    memoize(url, solvers)
                    setAllSolvers(solvers)
                } else {
                    setAllSolvers(memoize(url))
                }
            } catch (e) {
                console.log(e)
            }
        }

        fetchSolvers()
    }, [])

    const [allProblems, setAllProblems] = useState(undefined)

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                let url = config.apiUrl + 'training/problems'
                if (memoize(url) === undefined) {
                    const response = await fetch(url)
                    const problems = await response.json()
                    memoize(url, problems)
                    setAllProblems(problems)
                } else {
                    setAllProblems(memoize(url))
                }
            } catch (e) {
                console.log(e)
            }
        }

        fetchProblems()
    }, [])

    return (
        <Router>
            <Switch>
                <Route path="/dashboard">
                    <Dashboard solvers={allSolvers} problems={allProblems} />
                </Route>
                <Route path="/regular/summary">
                    <RegularSummary solvers={allSolvers} />
                </Route>
                <Route path="/regular/runs">
                    <SampleRuns solvers={allSolvers} problems={allProblems} />
                </Route>
                <Route path="/experimental/summary">
                    <ExperimentalSummary />
                </Route>
                <Route path="/experimental/runs">
                    <ExperimentalRuns />
                </Route>
                <Route path="/">
                    <Dashboard solvers={allSolvers} problems={allProblems} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App