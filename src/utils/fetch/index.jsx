/**
 * Customized Fetch
 * wrapped the `window.fetch()`, unify the data format and the error handling
 * 
 * @param  {...any} args same as the arguments `window.fetch()`
 */
async function Fetch(...args) {
  const res = await fetch(...args)
  if (res.ok) {
    let json = await res.json();
    const { status, error, ...others } = json
    if (status === 'failure') {
      return Promise.reject(error)
    }
    return Promise.resolve(others)
  } else {
    return Promise.reject('error')
  }
}

export default Fetch