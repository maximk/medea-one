import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import RegularCard from './RegularCard'
import ExperimentalCard from './ExperimentalCard'

function Dashboard({ solvers, problems }) {
    return (
        <>
            <Sidebar />
            <Box component='main' style={{ marginLeft: 240, display: 'flex' }}>
                <RegularCard solvers={solvers} problems={problems} />
                <ExperimentalCard />
            </Box>
        </>
    )
}

export default Dashboard