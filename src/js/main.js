import { simpleFetch } from './lib/simpleFetch.js'


document.addEventListener('DOMContentLoaded', () => {

    

})


async function getAPIData(apiURL, method = 'GET' , data) {
    let apiData
  
    try {
        let headers = new Headers()

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }

        apiData = await simpleFetch(apiURL, {
          // Si la petición tarda demasiado, la abortamos
          signal: AbortSignal.timeout(3000),
          method: method,
          body: data ?? undefined,
          headers: headers
        });
      } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        //console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          //console.error('Not found');
        }
        if (err.response.status === 500) {
          //console.error('Internal server error');
        }
      }
    }
    return apiData
  }