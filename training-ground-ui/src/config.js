const dev = {
    apiUrl: "http://localhost:8080/1/api/"
}

const prod = {
    apiUrl: "/1/api/"
}

const config = process.env.REACT_APP_DEV === "y" ? dev : prod

export default config
