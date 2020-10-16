import React, {useCallback, useState} from 'react';
import librarySummary from '../summary_of_libraries.json';
import {useHistory} from 'react-router';
import {compareByName, compareByFinalScore} from './funktions';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TableFooter,
    TablePagination,
    Tooltip,
    Checkbox,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    IconButton,
    TextField,
    InputAdornment
} from '@material-ui/core';

import {
    FilterList as FilterListIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    // ViewWeek as TableColumnIcon
} from '@material-ui/icons';

import TablePaginatoinActions from './TablePagination';

function filterSummary(arr, searchKey) {
    const reg = new RegExp(searchKey, 'i');
    return arr.filter(curr => curr.name.match(reg) || curr.description?.match(reg));
}

const goToCompare = (history, selectedPackages) => {
    if(selectedPackages.length > 0) {
        history.push(`/test-app/compare?query=${selectedPackages.join(',')}`);
        return;
    }

    history.push('/test-app/compare');
}

const Home = () => {
    const history = useHistory();
    const newLibrarySummary = librarySummary.libraries;
    const filterOptions = ['show only selected packages', 'sort by Score', 'sort by Name'];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [filterButtonAnchor, setFilterButtonAnchor] = useState(null);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [showSelectedPackages, setShowSelectedPackages] = useState(false);
    const [noSelectedPackages, setNoSelectedPackages] = useState(false);
    const [showSearchField, setShowSearchFiled] = useState(false);
    const [searchFieldInput, setSearchFieldInput] = useState('');
    const [filteredLibrarySummary, setFilteredLibrarySummary] = useState(newLibrarySummary);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredLibrarySummary.length - page * rowsPerPage);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    }, []);

    const handleTableClick = useCallback((event, name) => {
        const selectedIndex = selectedPackages.indexOf(name);
        let newSelected = [];

        switch(selectedIndex) {
            case -1:
                newSelected = newSelected.concat(selectedPackages, name);
                break;
            case 0:
                newSelected = newSelected.concat(selectedPackages.slice(1));
                break;
            case selectedPackages.length - 1:
                newSelected = newSelected.concat(selectedPackages.slice(0, -1));
                break;
            default:
                newSelected = newSelected.concat(
                    selectedPackages.slice(0, selectedIndex),
                    selectedPackages.slice(selectedIndex + 1),
                );
        }

        setSelectedPackages(newSelected);
    }, [selectedPackages]);

    const handleSearchFieldChange = useCallback((event) => {
        if(!event) event = {target: {value: ''}};
        setSearchFieldInput(event.target.value);
        setFilteredLibrarySummary(filterSummary(newLibrarySummary, event.target.value));
    }, [newLibrarySummary]);

    const handleShowSelectedPackagesButton = useCallback(() => {
        if(!showSelectedPackages) {
            const arr = [];
            selectedPackages.forEach((currSelected) => {
                const index = newLibrarySummary.map(currPackage => {return currPackage.name}).indexOf(currSelected);
                arr.push(newLibrarySummary[index]);
            })
            setFilteredLibrarySummary(arr);
            setPage(0);
        }
        else setFilteredLibrarySummary(newLibrarySummary);
        setShowSelectedPackages(!showSelectedPackages);
    }, [showSelectedPackages, newLibrarySummary, selectedPackages]);

    const handleMenuClose = useCallback((event, index) => {
        switch(index) {
            case 0:
                handleShowSelectedPackagesButton();
                break;
            case 1:
                setFilteredLibrarySummary([...filteredLibrarySummary.sort(compareByFinalScore)]);
                break;
            case 2:
                setFilteredLibrarySummary([...filteredLibrarySummary.sort(compareByName)]);
                break;
            default:
                console.error('something went wrong with the menu')
        }

        setFilterButtonAnchor(null);
    }, [filteredLibrarySummary, handleShowSelectedPackagesButton]);

    const handleCompareButton = useCallback(() => {
        if (selectedPackages.length > 0) {
            goToCompare(history, selectedPackages);
            return;
        }
        setNoSelectedPackages(true);
    }, [history, selectedPackages]);

    const handleSelectAll = useCallback((event) => {
        if(event.target.checked) {
            const newSelected = filteredLibrarySummary.map(curr => curr.name);
            setSelectedPackages(newSelected);
            return;
        }
        setSelectedPackages([]);
    }, [filteredLibrarySummary]);

    const isItemSelected = (name) => selectedPackages.indexOf(name) !== -1;

    return (
        <>
            <Dialog open={noSelectedPackages} onClose={() => setNoSelectedPackages(false)}>
                <DialogTitle>No packages selected</DialogTitle>
                <DialogContent>Do you really want to go to <b>compare</b>?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setNoSelectedPackages(false)}>
                        Abbrechen
                    </Button>
                    <Button onClick={() => goToCompare(history, selectedPackages)}>
                        Weiter
                    </Button>
                </DialogActions>
            </Dialog>

            <div style={{margin: '100px 10%'}}>
                <Paper>
                    <Toolbar style={{float: 'right'}}>
                        {showSearchField ? (
                        <div>
                            <TextField
                                placeholder='search packages'
                                value={searchFieldInput}
                                onChange={handleSearchFieldChange}
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                }}
                            />
<                           Tooltip title='hide table search'>
                                <IconButton 
                                    style={{color: 'red'}} 
                                    onClick={() => {
                                        setShowSearchFiled(false); 
                                        handleSearchFieldChange('');
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        ) : null}

                        <Tooltip title='show table search'>
                            <span>
                                <IconButton  
                                    color='primary' 
                                    size='medium'
                                    onClick={() => setShowSearchFiled(true)}
                                    disabled={showSearchField}
                                    style={{margin: 20}}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Tooltip title='filter table'>
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
                                    {index === 0 && showSelectedPackages ? 'show all packages' : option}
                                </MenuItem>
                            ))}
                        </Menu>

                        <Tooltip title='compare selected Packages'>
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={handleCompareButton}
                                style={{margin: 20}}
                            >
                                compare choosen packages
                            </Button>
                        </Tooltip>
                    </Toolbar>
                    <TableContainer>
                        <Table>
                            <colgroup>
                                <col width='10%' />
                                <col width='50%' />
                                <col width='5%' />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Tooltip title='select all'>
                                            <Checkbox 
                                                checked={filteredLibrarySummary.length > 0 && selectedPackages.length === filteredLibrarySummary.length}
                                                onChange={handleSelectAll}
                                            />
                                        </Tooltip>
                                        Name
                                    </TableCell>
                                    <TableCell align='center'>Description</TableCell>
                                    <TableCell align='center'>Final Score</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredLibrarySummary.length > 0 ? (
                                    rowsPerPage > 0 
                                        ? filteredLibrarySummary.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : filteredLibrarySummary
                                    ).map((curr, index) => (
                                        <TableRow 
                                            key={index}
                                            hover
                                            onClick={(event => handleTableClick(event, curr.name))}
                                            selected={isItemSelected(curr.name)}
                                        >
                                            <TableCell>
                                                <Checkbox checked={isItemSelected(curr.name)} /> 
                                                {curr.name}
                                            </TableCell>
                                            <TableCell>{curr.description}</TableCell>
                                            <TableCell align='right'>{Number((curr.finalScore).toFixed(3))}</TableCell>
                                        </TableRow>
                                    ),

                                    emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={3} />
                                        </TableRow>
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align='center'>
                                            <Typography variant='h4'>
                                                <Box fontWeight='fontWeightBold'>
                                                    No packages selected
                                                </Box>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[20, 50, 100, {label: 'All', value: -1}]}
                                        colSpan={3}
                                        count={filteredLibrarySummary.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            native: true,
                                        }}
                                        onChangePage={(event, newPage) => setPage(newPage)}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginatoinActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Paper>

                <Tooltip title='compare selected Packages'>
                    <Button
                        style={{marginTop: '3%', marginBottom: '5%', float: 'right'}}
                        variant='outlined'
                        color='primary'
                        onClick={handleCompareButton}
                    >
                        compare packages
                    </Button>
                </Tooltip>
            </div>
        </>
    )
}

export default Home;