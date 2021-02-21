import axios from 'axios'

class Axios{
    static #headers = (params) => {
        let headers = { headers: {'Accept' : 'application/json', 'Content-type' : 'application/json'}}
        for(let i in params) {
            headers.headers[i] = params[i]
        }
        return headers
    }
    static async get(url,setheaders = {}) {
        const headers = Axios.#headers(setheaders)

        return  await axios.get(url ,headers)
    }
    static async post(url , payload , setheaders = {}) {
        const headers = Axios.#headers(setheaders)
        return  await axios.post(url ,payload, headers)
    }
}

export default Axios;