import { useState } from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import TrainingSummary from './components/TrainingSummary'
import SampleRuns from './components/SampleRuns'
import Sidebar from './components/Sidebar'

function App() {
    const [allProblems, setAllProblems] = useState(['next', 'next-F', 'fizzbuzz'])
    const [allSolvers, setAllSolvers] = useState(['SS', 'FF', 'LS'])

    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                <Box component='main'>

                    {/*TODO add a dashboard here (total number of records in training tables, etc) */}

                    <Switch>
                        <Route path='/summary'>
                            <Typography variant="h3" marginTop={4} marginBottom={2}>Training Summary</Typography>
                            <TrainingSummary
                                setAllProblems={setAllProblems}
                                setAllSolvers={setAllSolvers}
                            />
                        </Route>
                        <Route path='/runs'>
                            <Typography variant="h3" marginTop={4} marginBottom={2}>Sample Runs</Typography>
                            <SampleRuns
                                allProblems={allProblems}
                                allSolvers={allSolvers}
                            />
                        </Route>
                    </Switch>
                </Box>
            </Box>
        </Router>
    )
}

export default App
