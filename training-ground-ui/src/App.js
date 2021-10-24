import styles from './App.module.css'

import Grid from '@mui/material/Grid'

import SummaryTable from "./components/SummaryTable"

function App() {
    return (
        <Grid className={styles.App} container spacing={2}>
            <Grid item xs={1} />
            <Grid item xs={10}>
                <h3>Training Summary</h3>
                <SummaryTable />
            </Grid>
            <Grid item xs={1} />
        </Grid>
    );
}

export default App;
