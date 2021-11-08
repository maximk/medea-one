import { MenuItem, Box, TextField, Typography } from "@mui/material";

import Sidebar from './Sidebar'
import RunPicker from "./RunPicker";

import { useLocation, useHistory } from 'react-router-dom'

export default function SampleRuns({ problems, solvers }) {
    const query = new URLSearchParams(useLocation().search)
    const problem = query.get('problem') || ''
    const solver = query.get('solver') || ''

    const history = useHistory()

    return <>
        <Sidebar />
        <Box component='main' style={{ marginLeft: 240 }}>
            <Box marginLeft={4}>
                <Typography variant="h4" mt={4} mb={2}>Sample Runs</Typography>
                <Box component='form' noValidate autoComplete='off' mt={4} mb={2}>
                    <TextField
                        select
                        label='Problem'
                        value={problem}
                        sx={{ width: '16ch', marginRight: 4 }}
                        onChange={(e) => history.push('/regular/runs?problem=' + e.target.value + '&solver=' + solver)}
                    >
                        {problems.map((p) => (
                            <MenuItem value={p} key={p}>{p}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label='Solver'
                        value={solver}
                        sx={{ width: '12ch' }}
                        onChange={(e) => history.push('/regular/runs?problem=' + problem + '&solver=' + e.target.value)}
                    >
                        {solvers.map((s) => (
                            <MenuItem value={s} key={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                </Box>
                {(problem !== '' && solver !== '')
                    ? <RunPicker problem={problem} solver={solver} />
                    : <div />
                }
            </Box>
        </Box>
    </>
}
