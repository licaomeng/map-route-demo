/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fetch from '../../utils/fetch'

export default function Geocoder(props) {
  const { label, latitude, longitude, onChange, value } = props;
  const defaultProps = {
    options: [],
    getOptionLabel: (option) => option.text,
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

  useEffect(() => {
    // controlled property value
    if (value) {
      // picked location on Map provider
      Dummy.fetchGeoList(value).then(location => {
        setLocation(location)
      })
    } else {
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
        value={location}
        onSelect={(v) => {
          const options = autocompleteProps.options
          const { center } = options.find(item => item.text === v.target.value) || {}
          onChange(center || [])
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
