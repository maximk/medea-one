import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import config from '../config'

export default () => {
    const { problem, solver } = useParams()

    const [sampleRuns, setSampleRuns] = useState()

    useEffect(() => {
        const fetchRun = async () => {
            try {
                var url = new URL(config.apiUrl + 'sample-runs')
                url.searchParams.append('problem', problem)
                url.searchParams.append('solver', solver)
                const response = await fetch(url)
                const sampleRuns = await response.json()
                setSampleRuns(sampleRuns)
            } catch (e) {
                console.log(e)
            }
        }

        fetchRun()
    }, [])

    if (!sampleRuns) {
        return <div>Loading...</div>
    }

    console.log(sampleRuns)

    // { price, signal, action, pnl }

    // show a range of buttons to choose the run (internal state, not url)

    // show price chart
    // add actions to price chart

    // show a summary table for actions
    // show total P/L

    return <div>
        Problem: {problem}
        <hr />
        Solver: {solver}
    </div>
}