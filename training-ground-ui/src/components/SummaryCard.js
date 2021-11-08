import { Paper } from "@mui/material"

function SummaryCard({ children }) {
    return <Paper sx={{ p: 4, m: 4, width: 320 }}>
        {children}
    </Paper>
}

export default SummaryCard