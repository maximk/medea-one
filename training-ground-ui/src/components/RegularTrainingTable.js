import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react";

import KnownResult from './KnownResult';
import SolverResult from './SolverResult';

import memoize from '../cache'
import config from '../config'

function RegularTrainingTable({ solvers }) {
    const [summary, setSummary] = useState()

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                let url = config.apiUrl + 'training/summary'
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

    if (!summary) {
        return <div>Loading...</div>
    }

    // Results cannot be sorted in BigQuery (easily)
    for (let i = 0; i < summary.length; i++)
        summary[i].results.sort((x, y) => (x.solver > y.solver) ? 1 : -1)

    const headers = ['Problem', 'Known'].concat(solvers)
    return <TableContainer component={Paper}>
        <Table sx={{ width: 960 }}>
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
}

export default RegularTrainingTable