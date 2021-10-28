import { Box, Paper, Typography } from "@mui/material";
import { TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from "@mui/material";
import { XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts";

const ActionDot = ({ cx, cy, r, stroke, payload }) => {
    var color = stroke
    if (payload.action.includes('Buy'))
        color = 'green'
    else if (payload.action.includes('Sell'))
        color = 'red'

    return <circle cx={cx} cy={cy} r={r} stroke={color} fill={color} />
}

export default function SampleRun({ data }) {
    const f = (x) => Math.round(x * 100) / 100

    var buy_count = 0
    var sell_count = 0
    var total_pnl = 0
    data.details.forEach(({ action, pnl }) => {
        if (action.includes('Buy'))
            buy_count++
        else if (action.includes('Sell'))
            sell_count++

        total_pnl += pnl
    })

    return <Box>
        <ResponsiveContainer width='100%' aspect={2.0 / 1.0}>
            <LineChart data={data.details}>
                <XAxis tick={false} />
                <YAxis domain={['dataMin - 10', 'dataMax']} tickFormatter={f} />
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={<ActionDot />} />
            </LineChart>
        </ResponsiveContainer>

        <Typography variant='h5' sx={{ marginTop: 2 }}>Run stats</Typography>
        <TableContainer component={Paper} sx={{ width: '50%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Parameter</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>%</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Auctions</TableCell>
                        <TableCell>{data.details.length}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Buy actions</TableCell>
                        <TableCell>{buy_count}</TableCell>
                        <TableCell>{f(buy_count / data.details.length * 100) + '%'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sell actions</TableCell>
                        <TableCell>{sell_count}</TableCell>
                        <TableCell>{f(sell_count / data.details.length * 100) + '%'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Active actions</TableCell>
                        <TableCell>{buy_count + sell_count}</TableCell>
                        <TableCell>{f((buy_count + sell_count) / data.details.length * 100) + '%'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total P&amp;L</TableCell>
                        <TableCell>{f(total_pnl)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

        <Typography variant='h5' sx={{ marginTop: 4 }}>Run details</Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Price</TableCell>
                        <TableCell>Signal</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>P&amp;L</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.details.map((x, i) => (
                        <TableRow key={i}>
                            <TableCell>{f(x.price)}</TableCell>
                            <TableCell>{x.signal}</TableCell>
                            <TableCell>{x.action}</TableCell>
                            <TableCell>{f(x.pnl)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}