import { Box, Button, Typography } from "@mui/material"
import { useHistory } from "react-router"
import ExperimentalSummaryTable from "./ExperimentalSummaryTable"
import Sidebar from "./Sidebar"

function ExperimentalSolutions(props) {
    const history = useHistory()

    return (
        <>
            <Sidebar />
            <Box component='main' style={{ marginLeft: 240 }}>
                <Box marginLeft={4}>
                    <Typography variant="h4" mt={4} mb={2}>Experimental Summary</Typography>
                    <ExperimentalSummaryTable {...props} />
                    <Button variant="contained" sx={{ mt: 4 }} onClick={() => history.push('/experimental/solutions')}>
                        Solutions
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default ExperimentalSolutions