import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ReactMapGL from 'react-map-gl';
import './App.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function App(props) {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  })
  const classes = useStyles();
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
      </Drawer>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_ACCESS_TOKEN}
        onViewportChange={(viewport) => setViewport(viewport)}
      />
    </div>
  );
}

App.defaultProps = {
  center: {
    lat: 59.95,
    lng: 30.33
  },
  zoom: 11
};

export default App;

