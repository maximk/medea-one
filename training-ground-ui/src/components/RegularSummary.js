import { Box, Typography } from "@mui/material"
import RegularTrainingTable from "./RegularTrainingTable"
import Sidebar from "./Sidebar"

function RegularSummary(props) {
    return (
        <>
            <Sidebar />
            <Box component='main' style={{ marginLeft: 240 }}>
                <Box marginLeft={4}>
                    <Typography variant="h4" mt={4} mb={2}>Training Summary</Typography>
                    <RegularTrainingTable {...props} />
                </Box>
            </Box>
        </>
    )
}

export default RegularSummary