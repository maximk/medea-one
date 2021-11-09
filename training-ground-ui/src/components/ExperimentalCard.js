import { Button, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import SummaryCard from './SummaryCard'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';

import memoize from '../cache'
import config from '../config'

function humanize(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function ExperimentalCard() {
    const history = useHistory()

    const [stats, setStats] = useState(undefined)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let url = config.apiUrl + 'experimental/stats'
                if (memoize(url) === undefined) {
                    const response = await fetch(url)
                    const stats = await response.json()
                    memoize(url, stats)
                    setStats(stats)
                } else {
                    setStats(memoize(url))
                }
            } catch (e) {
                console.log(e)
            }
        }

        fetchStats()
    }, [])

    const x = <>
        <Typography variant='h6'>Experimental training</Typography>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell align="right">3</TableCell>
                    <TableCell>problem templates</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="right">4,457</TableCell>
                    <TableCell>symbols</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="right">{stats ? humanize(stats.reports_received) : '-'}</TableCell>
                    <TableCell>reports received</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="right">{stats ? humanize(stats.solutions_found) : '-'}</TableCell>
                    <TableCell>solutions found</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Button variant="contained" sx={{ mt: 4 }} onClick={() => history.push('/experimental/summary')}>
            Proceed
        </Button>
    </>

    return <SummaryCard children={x} />
}

export default ExperimentalCard