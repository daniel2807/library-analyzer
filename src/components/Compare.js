import React, {useCallback, useState, useEffect} from 'react';
import librarySummary from '../summary_of_libraries.json';
import {useLocation, useHistory} from 'react-router';
import CompareCard from './CompareCard';
import {compareByFinalScore, compareByName, compareByDownloads, compareByStars} from './funktions';

import {
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  Grid,
} from '@material-ui/core';

import {
  Autocomplete,
} from '@material-ui/lab';

import {
  FilterList as FilterListIcon,
} from '@material-ui/icons';

const selectedPackagesForURL = (listOfSelectedPackages, history) => {
  if (listOfSelectedPackages.length === 0) history.push('/compare');

  const list = listOfSelectedPackages?.map(curr => curr.name);
  history.push(`/compare?query=${list.join(',')}`);
}

const Compare = () => {
  const searchPackages = useLocation().search;
  const history = useHistory();

  const newLibrarySummary = librarySummary.libraries;
  const filterOptions = ['sort by Score', 'sort by Name', 'sort by Downloads', 'sort by stars'];

  const [filterButtonAnchor, setFilterButtonAnchor] = useState(null);
  const [listOfSearchedLibraries, setListOfSearchedLibraries] = useState([newLibrarySummary[0]]);
  const [listOfPinedLibrariey, setListOfPinedLibraries] = useState([newLibrarySummary[0]]);
  const [duplicateEntry, setDuplicateEntry] = useState(false);
  const [currentSearchFieldValue, setCurrentSearchFieldValue] = useState('');

  useEffect(() => {
    if(searchPackages === '?query=') history.push('/compare');
    if(searchPackages) {
      const selectedPackages = searchPackages.split('?query=')[1].split(',');
      const arr = [];
      selectedPackages.forEach(currSelected => {
          const index = newLibrarySummary.map(currPackage => {return currPackage.name}).indexOf(currSelected);
          arr.push(newLibrarySummary[index]);
      })
      setListOfSearchedLibraries(arr);
      return;
    }

    setListOfSearchedLibraries([]);
  }, [newLibrarySummary, searchPackages, history])

  const handleMenuClose = useCallback((event, index) => {
    switch(index) {
        case 0:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByFinalScore)]);
          break;
        case 1:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByName)]);
          break;
        case 2:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByDownloads)]);
          break;
        case 3:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByStars)]);
          break;
        default:
          console.error('something went wrong with the menu')
    }

    setFilterButtonAnchor(null);
}, [listOfSearchedLibraries]);

  const addLibrary = useCallback((event) => {
    if(event.key !== 'Enter') return;

    setDuplicateEntry(false);
    setCurrentSearchFieldValue('');

    if(listOfSearchedLibraries.some(el => el.name === currentSearchFieldValue)) {
      setDuplicateEntry(true);
      return;
    }

    if(newLibrarySummary.some(el => el.name === currentSearchFieldValue)) {
      const list = [...listOfSearchedLibraries];
      list.push(newLibrarySummary.filter((curr) => curr.name === currentSearchFieldValue)[0]);
      setListOfSearchedLibraries(list);
      selectedPackagesForURL(list, history)
      return;
    }

    // make request to search this library!
    if(currentSearchFieldValue) {
     console.log('searching for ' + currentSearchFieldValue + ', wait a few seconds');
    }
  }, [newLibrarySummary, currentSearchFieldValue, listOfSearchedLibraries, history]);

const handlePinLibrary = useCallback((event) => {

}, []);

const handleDontPinLibrary = useCallback((event) => {

}, []);

  const handledropLibrary = useCallback((index) => {
    const list = [...listOfSearchedLibraries];
    list.splice(index, 1);
    setListOfSearchedLibraries(list);
    selectedPackagesForURL(list, history);
  }, [history, listOfSearchedLibraries])

  return (
    <div style={{margin: '100px 10%'}}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Autocomplete 
          style={{width: '50%'}}
          options={newLibrarySummary}
          getOptionLabel={(option) => option.name}
          inputValue={currentSearchFieldValue}
          onInputChange={(event, value) => setCurrentSearchFieldValue(value)}
          onChange={(event, value) => value ? setCurrentSearchFieldValue(value.name) : console.log()}
          noOptionsText='click enter to sarch this library'
          renderInput={params => 
            <TextField
              {...params}
              style={{marginBottom: 20}}
              error={duplicateEntry}
              label={duplicateEntry ? 'Eintrag schon vorhanden oder package nicht gefunden' : 'search library'}
              type='text'
              placeholder={duplicateEntry ? 'search library' : ''}
              rowsMax='1'
              margin='normal'
              variant='outlined'
              onKeyDown={addLibrary}
            />
          }
        />

        <Tooltip title='filter cards'>
          <IconButton 
            color='primary'
            onClick={event => setFilterButtonAnchor(event.currentTarget)}
            size='medium'
            style={{margin: 20}}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={filterButtonAnchor}
          keepMounted
          open={Boolean(filterButtonAnchor)}
          onClose={handleMenuClose}
        >
          {filterOptions.map((option, index) => (
            <MenuItem 
              key={index}
              onClick={event => handleMenuClose(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>

      {listOfSearchedLibraries[0] !== undefined && listOfSearchedLibraries.length > 0 ? (
        <Grid container spacing={2}>
          {listOfSearchedLibraries.map((curr, index) => (
            <Grid key={index} item xs={12} sm={12} md={6} lg={4}>
              <CompareCard 
                cardData={curr} 
                dropLibraryFunc={() => handledropLibrary(index)}
                pinLibraryFunc={() => handlePinLibrary(index)}
                dontPinLibraryFunc={() => handleDontPinLibrary(index)}
              />
            </Grid>
          ))}
        </Grid>
      ):(
        <Typography variant='h4' style={{textAlign: 'center'}}>
          <Box fontWeight='fontWeightBold'>
              No packages selected
          </Box>
        </Typography>
      )}
    </div>
  );
}

export default Compare;
