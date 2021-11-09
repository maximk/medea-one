import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import memoize from '../cache'
import config from '../config'

function ExperimentalTrainingTable() {
    const [summary, setSummary] = useState()

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                let url = config.apiUrl + 'experimental/summary'
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

    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Problem</TableCell>
                    <TableCell>Solver</TableCell>
                    <TableCell>Training time, ms</TableCell>
                    <TableCell>Prices observed</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {summary.map((x, i) =>
                    <TableRow key={i}>
                        <TableCell>
                            <Link to={'/experimental/runs?problem=' + x.problem + '&solver=' + x.solver}>
                                {x.problem}
                            </Link>
                        </TableCell>
                        <TableCell>{x.solver}</TableCell>
                        <TableCell>{x.train_time_ms}</TableCell>
                        <TableCell>{x.total_prices}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
}

export default ExperimentalTrainingTable