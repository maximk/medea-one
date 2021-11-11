import { Box, Typography } from "@mui/material"
import ExperimentalTrainingTable from "./ExperimentalTrainingTable"
import Sidebar from "./Sidebar"

function ExperimentalSolutions(props) {
    return (
        <>
            <Sidebar />
            <Box component='main' style={{ marginLeft: 240 }}>
                <Box marginLeft={4}>
                    <Typography variant="h4" mt={4} mb={2}>Experimental Solutions</Typography>
                    <ExperimentalTrainingTable {...props} />
                </Box>
            </Box>
        </>
    )
}

export default ExperimentalSolutions