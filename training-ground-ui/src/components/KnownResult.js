import styles from "../App.module.css"

export default (props) => {
    const ok = props.solved > 0 && props.unsolved == 0
    const unstable = props.solved > 0 && props.unsolved > 0
    const unknown = props.solved == 0 && props.unsolved == 0

    var s = "none"
    if (ok)
        s = "OK"
    if (unstable)
        s = "unstable (" + props.solved + " / " + props.unsolved + ")"
    if (unknown)
        s = "unknown"

    var cs = []
    if (unstable)
        cs.push(styles.unstable)

    return <div className={cs.join(" ")}>{s}</div>
}