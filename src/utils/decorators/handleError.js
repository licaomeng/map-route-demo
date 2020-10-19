/**
 * Customized decorator
 * wrap a Promise, unify error handling effect
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function closeLoading() {
  ReactDOM.render(
    <></>,
    document.getElementById('loading')
  );
}

function openAlert(e) {
  ReactDOM.render(
    <Snackbar open={true}>
      <Alert severity="error">
        {e?.message || e}
      </Alert>
    </Snackbar>,
    document.getElementById('alert')
  );
}

function closeAlert() {
  ReactDOM.render(
    <></>,
    document.getElementById('alert')
  );
}

export default (...config) => (target, name, descriptor) => {
  const origin = descriptor.value

  descriptor.value = async (...args) => {
    try {
      await origin(...args)
    } catch (e) {
      closeLoading()
      openAlert(e)
      setTimeout(() => {
        closeAlert()
      }, 6000)
    }
  }

  return descriptor
}