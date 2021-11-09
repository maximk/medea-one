import { Box, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import RunPicker from "./RunPicker"
import Sidebar from "./Sidebar"

function ExperimentalRuns() {
    const query = new URLSearchParams(useLocation().search)
    const problem = query.get('problem') || ''
    const solver = query.get('solver') || ''

    return <>
        <Sidebar />
        <Box component='main' style={{ marginLeft: 240 }}>
            <Box marginLeft={4}>
                <Typography variant='h4' mt={4} mb={2}>Experimental Runs</Typography>
                {(problem !== '' && solver !== '')
                    ? <RunPicker slug='experimental' problem={problem} solver={solver} />
                    : <div />
                }
            </Box>
        </Box>
    </>
}

export default ExperimentalRuns