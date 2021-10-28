import { MenuItem, Box, TextField } from "@mui/material";

import RunPicker from "./RunPicker";

import { useLocation, useHistory } from 'react-router-dom'

export default function SampleRuns({ allProblems, allSolvers }) {
    const query = new URLSearchParams(useLocation().search)
    const problem = query.get('problem') || ''
    const solver = query.get('solver') || ''

    const history = useHistory()

    return <div>
        <Box component='form' noValidate autoComplete='off' sx={{ marginTop: 4, marginBottom: 2 }}>
            <TextField
                select
                label='Problem'
                value={problem}
                sx={{ width: '16ch', marginRight: 4 }}
                onChange={(e) => history.push('/runs?problem=' + e.target.value + '&solver=' + solver)}
            >
                {allProblems.map((p) => (
                    <MenuItem value={p} key={p}>{p}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label='Solver'
                value={solver}
                sx={{ width: '12ch' }}
                onChange={(e) => history.push('/runs?problem=' + problem + '&solver=' + e.target.value)}
            >
                {allSolvers.map((s) => (
                    <MenuItem value={s} key={s}>{s}</MenuItem>
                ))}
            </TextField>
        </Box>
        {(problem !== '' && solver !== '')
            ? <RunPicker problem={problem} solver={solver} />
            : <div />
        }
    </div>
}
