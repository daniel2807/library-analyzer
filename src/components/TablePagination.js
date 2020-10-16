import React, {useCallback} from 'react';
import propTypes from 'prop-types';

import {
    IconButton,
    Tooltip,
    useTheme,
    makeStyles,
} from "@material-ui/core";

import {
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    SkipNext as SkipNextIcon,
    SkipPrevious as SkipPreviousIcon,
} from '@material-ui/icons';

const useStyle = makeStyles((theme) => ({
    tableFooter: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

export default function TablePaginatoinActions(props) {
    const classes = useStyle();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    const handleFirstPageButton = useCallback((event) => {
        onChangePage(event, 0);
    }, [onChangePage]);

    const handleBackButton = useCallback((event) => {
        onChangePage(event, page - 1);
    }, [onChangePage, page]);

    const handleSkipBackwardButton = useCallback((event) => {
        onChangePage(event, page - 5);
    }, [onChangePage, page]);

    const handleSkipForwardButton = useCallback((event) => {
        onChangePage(event, page + 5);
    }, [onChangePage, page]);

    const handleNextButton = useCallback((event) => {
        onChangePage(event, page + 1);
    }, [onChangePage, page]);

    const handleLastPageButton = useCallback((event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }, [onChangePage, count, rowsPerPage]);

    return (
        <div className={classes.tableFooter}>
            <Tooltip title='first page'>
                <span>
                    <IconButton
                        onClick={handleFirstPageButton}
                        disabled={page === 0}
                    >
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title='skip 5 pages backward'>
                <span>
                    <IconButton
                        onClick={handleSkipBackwardButton}
                        disabled={page < 5}
                    >
                        <SkipPreviousIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title='previos page'>
                <span>
                    <IconButton
                        onClick={handleBackButton}
                        disabled={page === 0}
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title='next page'>
                <span>
                    <IconButton
                        onClick={handleNextButton}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title='skip 5 pages forward'>
                <span>
                    <IconButton
                        onClick={handleSkipForwardButton}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 5}
                    >
                        <SkipNextIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title='last page'>
                <span>
                    <IconButton
                        onClick={handleLastPageButton}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    >
                        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}                
                    </IconButton>
                </span>
            </Tooltip>
        </div>
    );
}

TablePaginatoinActions.propTypes = {
    count: propTypes.number.isRequired,
    onChangePage: propTypes.func.isRequired,
    page: propTypes.number.isRequired,
    rowsPerPage: propTypes.number.isRequired,
}
