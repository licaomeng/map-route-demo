/**
 * Customized decorator
 * wrap a Promise, unify the loading and error handling effect
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function closeLoading() {
  ReactDOM.render(
    <span></span>,
    document.getElementById('loading')
  );
}

function openLoading(classes) {
  ReactDOM.render(
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>,
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
    <span></span>,
    document.getElementById('alert')
  );
}

export default (...config) => (target, name, descriptor) => {
  const origin = descriptor.value
  const classes = useStyles();

  descriptor.value = async (...args) => {
    try {
      openLoading(classes)
      await origin(...args)
      closeLoading()
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