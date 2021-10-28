const cache = {}

export default function memoize(key, value) {
    if (value !== undefined) {
        cache[key] = value
    }

    return cache[key]
}
