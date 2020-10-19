/**
 * Customized Fetch
 * wrapped the `window.fetch()`, unify the data format and the error handling
 * 
 * "in progress": retry
 * "failure": error msg
 * "success": display data
 * 
 * @param  {...any} args same as the arguments `window.fetch()`, also append retry times
 */
async function Fetch(...args) {
  let [url, options, times = 0] = args
  if (times >= 5) {
    // retry times limited to 5
    return Promise.reject('request time out')
  }
  const res = await fetch(url, options)
  if (res.ok) {
    // succeeded
    let json = await res.json();
    const { status, error, ...others } = json
    if (status === 'failure') {
      return Promise.reject(error)
    }
    if (status === 'in progress') {
      // retry logic
      return Fetch(url, options, ++times)
    }
    return Promise.resolve(others)
  } else if(res.status === 500) {
    // 500: Internal Server Error
    return Promise.reject('Internal Server Error')
  } else {
    // other codes
    return Promise.reject('request failed')
  }
}

export default Fetch