import { useState, useEffect } from 'react'

import { Typography, Tab, Divider } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'

import SampleRun from './SampleRun'

import memoize from '../cache'
import config from '../config'

export default function RunPicker({ slug, problem, solver }) {
    const [runs, setRuns] = useState()
    const [selectedRun, setSelectedRun] = useState('1')

    useEffect(() => {
        const fetchRuns = async () => {
            try {
                let url = config.apiUrl + slug + '/runs?problem=' + problem + '&solver=' + solver
                if (memoize(url) === undefined) {
                    const response = await fetch(url)
                    const runs = await response.json()
                    memoize(url, runs)
                    setRuns(runs)
                } else {
                    setRuns(memoize(url))
                }
            } catch (e) {
                console.log(e)
            }
        }

        fetchRuns()
    })

    if (runs === undefined) {
        return <div>Loading...</div>
    }

    if (runs.length === 0) {
        return <Typography>No runs available</Typography>
    }

    return <TabContext value={selectedRun}>
        <TabList onChange={(e, v) => setSelectedRun(v)}>
            {runs.map((r, i) => (
                <Tab label={i + 1} value={(i + 1).toString()} key={i} />
            ))}
        </TabList>
        <Divider />
        {runs.map((r, i) => (
            <TabPanel value={(i + 1).toString()} key={i}>
                <SampleRun data={r} />
            </TabPanel>
        ))}
    </TabContext >
}
