import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Container, Row, Col } from 'react-bootstrap'

import SummaryTable from "./components/SummaryTable"

function App() {
    return (
        <div className="App">
            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={8}>
                        <h3>Training Summary</h3>
                        <SummaryTable />
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
