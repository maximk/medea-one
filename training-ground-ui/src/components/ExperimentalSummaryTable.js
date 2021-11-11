import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import memoize from '../cache'
import config from '../config'

function ExperimentalSummaryTable() {
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

    return <TableContainer sx={{ width: 640 }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Template</TableCell>
                    <TableCell>Solver</TableCell>
                    <TableCell align='right'>Solutions found</TableCell>
                    <TableCell align='right'>Reports received</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {summary.map((x, i) =>
                    <TableRow key={i}>
                        <TableCell>{x.template}</TableCell>
                        <TableCell>{x.solver}</TableCell>
                        <TableCell align='right'>{x.solutions_found}</TableCell>
                        <TableCell align='right'>{x.reports_received}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
}

export default ExperimentalSummaryTable