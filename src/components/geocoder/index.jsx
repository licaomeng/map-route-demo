/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fetch from '../../utils/fetch'
import { isEmptyObj } from '../../utils/is'

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Geocoder(props) {
  const {
    label,
    // proximity
    latitude,
    longitude,
    // coordinate
    onChange,
    // location name
    onLocationChange,
    // controlled prop
    value
  } = props;
  const defaultProps = {
    options: [],
    getOptionLabel: (option) => option?.text || '',
  };

  // Dummy class here for decorators' using
  class Dummy {
    // invoke Mapbox Geocoding API
    // Doc see: https://docs.mapbox.com/api/search/#geocoding
    // searchText supports two formats: 1. plain text; 2. string `${longitude},${latitude}`
    static async fetchGeoList(searchText) {
      // access token
      const accessToken = process.env.REACT_APP_ACCESS_TOKEN
      // default to current location
      const proximity = [longitude, latitude]
      const res = await Fetch(`//api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(searchText)}.json?proximity=${proximity}&access_token=${accessToken}`)
      // update Autocomplete options
      setAutocompleteProps({
        ...defaultProps,
        options: res.features
      })
      // return first option to fill TextField
      return res.features?.[0]
    }
  }

  const prevValue = usePrevious(value)
  useEffect(() => {
    // controlled property value
    if (value && !prevValue) {
      // picked location on Map provider
      Dummy.fetchGeoList(value).then(location => {
        setLocation(location)
        onLocationChange(location?.text)
      })
    } else if (!value) {
      // remove value
      setLocation('')
    }
  }, [value])

  // mainly set options
  const [autocompleteProps, setAutocompleteProps] = useState(defaultProps)
  // set `value` field
  const [location, setLocation] = useState('')

  return (
    <div style={{ width: 300 }}>
      <Autocomplete
        {...autocompleteProps}
        value={isEmptyObj(location) ? '' : location}
        onSelect={(v) => {
          const options = autocompleteProps.options
          const item = options.find(item => item.text === v.target.value) || {}
          const { center = [], text = '' } = item
          setLocation(item)
          onChange(center)
          onLocationChange(text)
        }}
        renderInput={(params) =>
          <TextField
            {...params}
            label={label}
            margin="normal"
            onChange={v => {
              Dummy.fetchGeoList(v.target.value)
            }}
          />
        }
      />
    </div>
  );
}
