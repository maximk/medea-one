import { useState, useEffect } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import KnownResult from './KnownResult';
import SolverResult from './SolverResult';

import config from '../config'

export default function SummaryTable() {

    const [data, setData] = useState({ summary: [], isFetching: false })

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setData({ summary: data.summary, isFetching: true })
                const response = await fetch(config.apiUrl + "training-summary")
                const summary = await response.json()
                setData({ summary: summary, isFetching: false })
            } catch (e) {
                console.log(e)
                setData({ summary: data.summary, isFetching: false })
            }
        }

        fetchSummary();
    }, [])

    if (data.summary.length == 0) {
        return <div>Loading...</div>
    }

    // Results for each problem guaranteed to include all solvers
    const allsolvers = data.summary[0].results.map(({ solver }) => solver).sort()

    // Results cannot be sorted in BigQuery (easily)
    for (let i = 0; i < data.summary.length; i++)
        data.summary[i].results.sort((x, y) => (x.solver > y.solver) ? 1 : -1)

    const headers = ["Problem", "Known"].concat(allsolvers)
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((h) => <TableCell>{h}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.summary.map((x) =>
                        <TableRow>
                            <TableCell>{x.problem}</TableCell>
                            <TableCell>
                                <KnownResult solved={x.num_known_solved} unsolved={x.num_known_unsolved} />
                            </TableCell>
                            {x.results.map((r) =>
                                <TableCell>
                                    <SolverResult
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
