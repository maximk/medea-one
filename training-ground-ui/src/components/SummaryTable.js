import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import config from '../config'

function SummaryTable() {

    const [data, setData] = useState({ summary: [], isFetching: false })

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setData({ summary: data.summary, isFetching: true })
                const response = await fetch(config.apiUrl + "training-summary")
                const summary = await response.json()
                setData({ summary: summary, isFetching: false })
            } catch (e) {
                console.log(e)
                setData({ summary: data.summary, isFetching: false })
            }
        }

        fetchSummary();
    }, [])

    const number = { textAlign: "right" }

    return (<Table striped hover>
        <thead>
            <tr>
                <th>Problem</th>
                <th>Solver</th>
                <th style={number}>Errors</th>
                <th style={number}>Solved</th>
                <th style={number}>Unsolved</th>
            </tr>
        </thead>
        <tbody>
            {
                data.summary.map((o, index) => {
                    const { p, s, ne, ns, nu } = o
                    return (
                        <tr key={index}>
                            <td>{p}</td>
                            <td>{s}</td>
                            <td style={number}>{ne}</td>
                            <td style={number}>{ns}</td>
                            <td style={number}>{nu}</td>
                        </tr>
                    )
                })
            }
        </tbody>
    </Table>)
}

export default SummaryTable