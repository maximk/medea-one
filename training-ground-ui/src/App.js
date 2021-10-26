import styles from './App.module.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Grid from '@mui/material/Grid'

import SummaryTable from './components/SummaryTable'
import SampleRuns from './components/SampleRuns'

function App() {
    return (
        <Router>
            <Grid className={styles.App} container spacing={2}>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Switch>
                        <Route path='/summary'>
                            <h3>Training Summary</h3>
                            <SummaryTable />
                        </Route>
                        <Route path='/problems/:problem/solvers/:solver'>
                            <h3>Training Runs</h3>
                            <SampleRuns />
                        </Route>
                    </Switch>
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
        </Router >
    )
}

export default App;
