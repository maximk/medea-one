import { useState, useEffect } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import memoize from '../cache'

import KnownResult from './KnownResult';
import SolverResult from './SolverResult';

import config from '../config'
import { Box } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

export default function TrainingSummary({ setAllProblems, setAllSolvers }) {
    const [summary, setSummary] = useState()

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                let url = config.apiUrl + 'training-summary'
                if (memoize(url) === undefined) {
                    const response = await fetch(url)
                    const summary = await response.json()
                    memoize(url, summary)
                    setSummary(summary)
                } else {
                    setSummary(memoize(url))
                }
            } catch (e) {
                console.log(e)
            }
        }

        fetchSummary()
    }, [])

    useEffect(() => {
        if (summary) {
            let allProblems = summary.map(({ problem }) => problem).sort()
            setAllProblems(allProblems)

            let allSolvers = summary[0].results.map(({ solver }) => solver).sort()
            setAllSolvers(allSolvers)
        }
    }, [summary])

    if (!summary) {
        return <div>Loading...</div>
    }

    // Results for each problem guaranteed to include all solvers
    const allSolvers = summary[0].results.map(({ solver }) => solver).sort()

    // Results cannot be sorted in BigQuery (easily)
    for (let i = 0; i < summary.length; i++)
        summary[i].results.sort((x, y) => (x.solver > y.solver) ? 1 : -1)

    const headers = ['Problem', 'Known'].concat(allSolvers)
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 960 }}>
                <TableHead>
                    <TableRow>
                        {headers.map((h, i) => <TableCell key={i}>{h}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {summary.map((x, i) =>
                        <TableRow key={i}>
                            <TableCell>{x.problem}</TableCell>
                            <TableCell>
                                <KnownResult solved={x.num_known_solved} unsolved={x.num_known_unsolved} />
                            </TableCell>
                            {x.results.map((r, i) =>
                                <TableCell key={i}>
                                    <SolverResult
                                        problem={x.problem}
                                        solver={r.solver}
                                        errors={r.num_errors}
                                        solved={r.num_solved}
                                        unsolved={r.num_unsolved} />
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}