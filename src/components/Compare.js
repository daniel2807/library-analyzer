import React, {useCallback, useState, useEffect} from 'react';
import librarySummary from '../summary_of_libraries.json';
import {useLocation, useHistory} from 'react-router';
import CompareCard from './CompareCard';
import Footer from './Footer';
import firebase from './firebase';
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
  makeStyles,
} from '@material-ui/core';

import {
  Autocomplete,
} from '@material-ui/lab';

import {
  FilterList as FilterListIcon,
} from '@material-ui/icons';

const useStyle = makeStyles((theme) => ({
  footer: {
      marginLeft: '-10%',
      marginRight: '-10%',
      position: 'absolute',
      bottom: 0,
      width: '98%',
      height: '60px',   /* Height of the footer */
  }
}));

const selectedPackagesForURL = (listOfSelectedPackages, history) => {
  if (listOfSelectedPackages.length === 0) history.push('/compare');

  const list = listOfSelectedPackages?.map(curr => curr.name);
  history.push(`/compare?query=${list.join(',')}`);
}

const Compare = () => {
  const classes = useStyle();
  const searchedUrlPackages = useLocation().search;
  const history = useHistory();

  const newLibrarySummary = librarySummary.libraries;
  const filterOptions = ['sort by Score', 'sort by Name', 'sort by Downloads', 'sort by stars'];
  const localStorageName = 'pinedLibraries';

  const [filterButtonAnchor, setFilterButtonAnchor] = useState(null);
  const [listOfSearchedLibraries, setListOfSearchedLibraries] = useState([]);
  const [listOfPinedLibraries, setListOfPinedLibraries] = useState([]);
  const [duplicateEntry, setDuplicateEntry] = useState(false);
  const [currentSearchFieldValue, setCurrentSearchFieldValue] = useState('');

  useEffect(() => {
    if(!firebase.getCurrentUsername()) {
      history.push('/login');
      return;
    }
    if(searchedUrlPackages === '?query=') history.push('/compare');
    if(searchedUrlPackages) {
      const selectedPackages = searchedUrlPackages.split('?query=')[1].split(',');
      const listOfChoosenLibraries = [];

      selectedPackages.forEach(currSelected => {
          const index = newLibrarySummary.map(e => {return e.name}).indexOf(currSelected);
          listOfChoosenLibraries.push(newLibrarySummary[index]);
      })
      setListOfSearchedLibraries(listOfChoosenLibraries);

      if(localStorage.getItem(localStorageName)) {
        const test = JSON.parse(localStorage.getItem(localStorageName));
        const arr = [];

        test.forEach((testE) => {
          if(listOfChoosenLibraries.some(listE => listE.name === testE.name)) arr.push(testE);
        })
        setListOfPinedLibraries(arr);
      }
    } 
  }, [newLibrarySummary, searchedUrlPackages, history])

  const handleMenuClose = useCallback((event, index) => {
    switch(index) {
        case 0:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByFinalScore)]);
          setListOfPinedLibraries([...listOfPinedLibraries.sort(compareByFinalScore)]);
          break;
        case 1:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByName)]);
          setListOfPinedLibraries([...listOfPinedLibraries.sort(compareByName)]);
          break;
        case 2:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByDownloads)]);
          setListOfPinedLibraries([...listOfPinedLibraries.sort(compareByDownloads)]);
          break;
        case 3:
          setListOfSearchedLibraries([...listOfSearchedLibraries.sort(compareByStars)]);
          setListOfPinedLibraries([...listOfPinedLibraries.sort(compareByStars)]);
          break;
        default:
          console.error('something went wrong with the menu')
    }

    setFilterButtonAnchor(null);
}, [listOfSearchedLibraries, listOfPinedLibraries]);

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

  const handledropLibrary = useCallback((nameOfLibrary) => {
    if(listOfSearchedLibraries.length === 1) {
      setListOfSearchedLibraries([]);
      setListOfPinedLibraries([]);
      return;
    }

    const choosenList = [...listOfSearchedLibraries];
    const pinedList = [...listOfPinedLibraries];
    const indexOfPinedListItem = pinedList.map((e) => {return e.name}).indexOf(nameOfLibrary);
    const indexOfChoosenListItem = choosenList.map((e) => {return e.name}).indexOf(nameOfLibrary);

    if(indexOfPinedListItem !== -1) {
      pinedList.splice(indexOfPinedListItem, 1);
      setListOfPinedLibraries(pinedList);
      localStorage.setItem(localStorageName, JSON.stringify(pinedList));
    }

    choosenList.splice(indexOfChoosenListItem, 1);
    setListOfSearchedLibraries(choosenList);
    selectedPackagesForURL(choosenList, history);
  }, [history, listOfSearchedLibraries, listOfPinedLibraries]);

  const addPinedLibrary = useCallback((index) => {
    const pinedList = [...listOfPinedLibraries];
    pinedList.push(listOfSearchedLibraries[index]);
    setListOfPinedLibraries(pinedList);
    localStorage.setItem(localStorageName, JSON.stringify(pinedList));
  }, [listOfPinedLibraries, listOfSearchedLibraries]);

  const dropPinedLibrary = useCallback((index) => {
    const pinedList = [...listOfPinedLibraries];
    pinedList.splice(index, 1);
    setListOfPinedLibraries(pinedList);
    localStorage.setItem(localStorageName, JSON.stringify(pinedList));
  }, [listOfPinedLibraries]);

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

      {listOfSearchedLibraries.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {listOfPinedLibraries?.map((curr, index) => (
              <Grid key={index} item xs={12} sm={12} md={6} lg={4}>
                <CompareCard 
                  cardData={curr} 
                  dropLibraryFunc={() => handledropLibrary(curr.name)}
                  pined={true}
                  pinFunc={() => dropPinedLibrary(index)}
                />
              </Grid>
            ))}
          
            {listOfSearchedLibraries?.map((curr, index) => 
              !listOfPinedLibraries.some(el => el.name === curr.name) ? (
                <Grid key={index} item xs={12} sm={12} md={6} lg={4}>
                  <CompareCard 
                    cardData={curr} 
                    dropLibraryFunc={() => handledropLibrary(curr.name)}
                    pined={false}
                    pinFunc={() => addPinedLibrary(index)}
                  />
                </Grid>
              ): null
            )}
          </Grid>
          <div style={{marginTop: '5%'}}>
            <Footer />
          </div>
        </>
      ):(
        <>
          <Typography variant='h4' style={{textAlign: 'center'}}>
            <Box fontWeight='fontWeightBold'>
                No library selected
            </Box>
          </Typography>

          <div className={classes.footer}>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

export default Compare;
