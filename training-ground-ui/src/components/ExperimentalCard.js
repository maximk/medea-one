import { Button, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import SummaryCard from './SummaryCard'
import { useHistory } from 'react-router-dom'

function ExperimentalCard() {
    const history = useHistory()

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
                    <TableCell align="right">14,333 (?)</TableCell>
                    <TableCell>reports received</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="right">1,964 (?)</TableCell>
                    <TableCell>solutions found</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Button variant="contained" sx={{ mt: 4 }} onClick={() => history.push('/experimental/summaery')}>
            Proceed
        </Button>
    </>

    return <SummaryCard children={x} />
}

export default ExperimentalCard