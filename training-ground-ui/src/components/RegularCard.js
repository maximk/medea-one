import { Button, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import SummaryCard from './SummaryCard'
import { useHistory } from 'react-router-dom'

import memoize from '../cache'
import config from '../config'
import { useEffect, useState } from 'react'

function humanize(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function RegularCard({ problems, solvers }) {
    const history = useHistory()

    const [stats, setStats] = useState(undefined)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let url = config.apiUrl + 'training/stats'
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
        <Typography variant='h6'>Regular training</Typography>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell align="right">4</TableCell>
                    <TableCell>runs per day</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="right">{problems ? problems.length : '-'}</TableCell>
                    <TableCell>problems</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="right">{solvers ? solvers.length : '-'}</TableCell>
                    <TableCell>solvers</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="right">{stats ? humanize(stats.reports_collected) : '-'}</TableCell>
                    <TableCell>reports collected</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Button variant="contained" sx={{ mt: 4 }} onClick={() => history.push('/regular/summary')}>
            Proceed
        </Button>
    </>

    return <SummaryCard children={x} />
}

export default RegularCard