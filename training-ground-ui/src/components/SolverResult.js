import styles from '../App.module.css'

import { Link } from 'react-router-dom'

export default function SolverResult(props) {
    const ok = props.solved > 0 && props.unsolved === 0
    const fail = props.solved === 0 && props.unsolved > 0
    const unstable = props.solved > 0 && props.unsolved > 0
    const unknown = props.solved === 0 && props.unsolved === 0

    var s = 'OK'
    if (fail)
        s = 'fail'
    if (unstable)
        s = 'unstable (' + props.solved + ' / ' + props.unsolved + ')'
    if (unknown)
        s = 'unknown'

    var cs = [styles.runlink]
    if (ok)
        cs.push(styles.ok)
    if (fail)
        cs.push(styles.fail)
    if (unstable)
        cs.push(styles.unstable)

    return <Link
        className={cs.join(' ')}
        to={'/runs?problem=' + props.problem + '&solver=' + props.solver}>{s}</Link>
}