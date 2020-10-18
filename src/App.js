import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from './components/geocoder'
import PolylineOverlay from './components/polyline-overlay'
import './App.css';

const drawerWidth = 360;

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
  drawerContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
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
  const initViewport = {
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: 122.4376,
    zoom: 13
  }
  const [viewport, setViewport] = useState({ ...initViewport })
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = viewport
      if (latitude === initViewport.latitude && longitude === initViewport.longitude) {
        setViewport({
          ...initViewport,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      }
    });
  }
  const classes = useStyles();
  const [start, setStart] = useState([])
  const [end, setEnd] = useState([])
  const handleClick = val => {
    const { lngLat: [longitude, latitude] } = val
    if (!start.length) {
      setStart([longitude, latitude])
    } else if (!end.length) {
      setEnd([longitude, latitude])
    }
  }

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
        <div className={classes.drawerContainer}>
          <Geocoder
            label="Starting location"
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            value={start.join(',')}
            onChange={(start) => setStart(start)}
          />
          <Geocoder
            label="Drop-off point"
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            value={end.join(',')}
            onChange={(end) => setEnd(end)}
          />
        </div>
      </Drawer>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_ACCESS_TOKEN}
        onViewportChange={(viewport) => setViewport(viewport)}
        onClick={handleClick}
      >
        {
          start.length && (
            <Marker offsetTop={-10} offsetLeft={-5} longitude={start[0]} latitude={start[1]}>
              <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
                <image href="https://www.flaticon.com/svg/static/icons/svg/33/33759.svg" height="10" width="10" />
              </svg>
            </Marker>
          )
        }
        {
          end.length && (
            <Marker offsetTop={-27} offsetLeft={-11} longitude={end[0]} latitude={end[1]}>
              <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                <image href="https://www.flaticon.com/svg/static/icons/svg/565/565949.svg" height="12" width="12" />
              </svg>
              <svg transform="translate(-22,-8)" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <image href="https://www.flaticon.com/svg/static/icons/svg/252/252025.svg" height="32" width="32" />
              </svg>
            </Marker>
          )
        }
        <PolylineOverlay points={[
          [114.174601, 22.293033],
          [114.17204799999999, 22.298614]]} />
      </ReactMapGL>
    </div>
  );
}

export default App;

