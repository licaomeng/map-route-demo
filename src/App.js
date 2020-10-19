import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ReactMapGL, { Marker, GeolocateControl } from 'react-map-gl';
import { isSafari, isMobile } from "react-device-detect";
import Geocoder from './components/geocoder'
import PolylineOverlay from './components/polyline-overlay'
import Fetch from './utils/fetch'
import loading from './utils/decorators/loading'
import handleError from './utils/decorators/handleError'
import "mapbox-gl/dist/mapbox-gl.css";
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
    flexDirection: 'row'
  },
  geolocateControl: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '20px'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexGrow: 1
  },
  searchBtnContainer: {
    padding: '60px 0'
  },
  resultContainer: {
    display: 'flex',
    alignItems: 'left',
    margin: '-8px 5% 15px 5%',
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
  const classes = useStyles();
  const [viewport, setViewport] = useState({ ...initViewport })
  const [waypoints, setWaypoints] = useState([])
  const [start, setStart] = useState([])
  const [end, setEnd] = useState([])
  const [startText, setStartText] = useState('')
  const [endText, setEndText] = useState('')
  const [result, setResult] = useState({})
  if ("geolocation" in navigator) {
    // default to the current location
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
  const handleClick = val => {
    const { lngLat: [longitude, latitude] } = val
    if (!start.length) {
      setStart([longitude, latitude])
    } else if (!end.length) {
      setEnd([longitude, latitude])
    }
  }

  // this dummy class for the use of decorators
  class Dummy {
    @handleError()
    @loading()
    static async fetchRoute() {
      const { token } = await Fetch('//mock-api.dev.lalamove.com/route', {
        method: 'POST',
        // mode: "no-cors",
        body: JSON.stringify({
          origin: startText,
          destination: endText
        })
      });
      const res = await Fetch(`//mock-api.dev.lalamove.com/route/${token}`)
      const { path, total_distance, total_time } = res
      setWaypoints(path)
      setResult({ total_distance, total_time })
    }
  }

  useEffect(() => {
    if (startText && endText) {
      // automatically perform request when both filled
      Dummy.fetchRoute()
    }
    if (!startText || !endText) {
      // reset when one of them removed
      setWaypoints([])
      setResult({})
    }
  }, [startText, endText])

  const renderEndMarker = () => {
    if (!end.length) {
      return null
    }
    if (isSafari) {
      return <Marker offsetTop={-16} offsetLeft={-32} longitude={end[0]} latitude={end[1]}>
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <image href="https://www.flaticon.com/svg/static/icons/svg/252/252025.svg" height="32" width="32" />
        </svg>
      </Marker>
    }
    return <Marker offsetTop={-27} offsetLeft={-11} longitude={end[0]} latitude={end[1]}>
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
        <image href="https://www.flaticon.com/svg/static/icons/svg/565/565949.svg" height="12" width="12" />
      </svg>
      <svg transform="translate(-22,-8)" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <image href="https://www.flaticon.com/svg/static/icons/svg/252/252025.svg" height="32" width="32" />
      </svg>
    </Marker>
  }

  const renderStartMarker = () => {
    if (!start.length) return null
    return <Marker offsetTop={-10} offsetLeft={-5} longitude={start[0]} latitude={start[1]}>
      <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
        <image href="https://www.flaticon.com/svg/static/icons/svg/33/33759.svg" height="10" width="10" />
      </svg>
    </Marker>
  }

  const renderSearchBar = () => {
    return <>
      <div className={classes.drawerContainer}>
        <div className={classes.inputContainer}>
          <Geocoder
            label="Starting location"
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            value={start.join(',')}
            onChange={(start) => setStart(start)}
            onLocationChange={v => setStartText(v)} />
          <Geocoder
            label="Drop-off point"
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            value={end.join(',')}
            onChange={(end) => setEnd(end)}
            onLocationChange={v => setEndText(v)} />
        </div>
        {
          startText && endText && (
            <span className={classes.searchBtnContainer}>
              <IconButton aria-label="search" className={classes.margin}
                onClick={() => Dummy.fetchRoute()}>
                <SearchIcon fontSize="inherit" />
              </IconButton>
            </span>
          )
        }
      </div>

      <div className={classes.resultContainer}>
        {result.total_distance && <span>Total Distance: {result.total_distance}</span>}
        {result.total_time && <span>Total Time: {result.total_time}</span>}
      </div>
    </>
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {
        !isMobile ? (
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{ paper: classes.drawerPaper }}
            anchor="left">
            {renderSearchBar()}
          </Drawer>
        ) : renderSearchBar()
      }
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_ACCESS_TOKEN}
        onViewportChange={(viewport) => setViewport(viewport)}
        onClick={handleClick}>
        <div className={classes.geolocateControl}>
          {
            (!startText || !endText) && <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true} />
          }
        </div>
        {
          waypoints.map((item, i) =>
            <Marker key={i} offsetTop={-10} offsetLeft={-15}
              longitude={Number(item[1])} latitude={Number(item[0])}>
              <b>{++i}</b>
            </Marker>
          )
        }
        {renderStartMarker()}
        {renderEndMarker()}
        {startText && endText && <PolylineOverlay points={waypoints} />}
      </ReactMapGL>
    </div>
  );
}

export default App;

