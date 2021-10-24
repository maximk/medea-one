import styles from "../App.module.css"

export default (props) => {
    const ok = props.solved > 0 && props.unsolved == 0
    const fail = props.solved == 0 && props.unsolved > 0
    const unstable = props.solved > 0 && props.unsolved > 0
    const unknown = props.solved == 0 && props.unsolved == 0

    var s = "OK"
    if (fail)
        s = "fail"
    if (unstable)
        s = "unstable"
    if (unknown)
        s = "unknown"

    var cs = []
    if (ok)
        cs.push(styles.ok)
    if (fail)
        cs.push(styles.fail)
    if (unstable)
        cs.push(styles.unstable)

    return <div className={cs.join(" ")}>{s}</ div >
}