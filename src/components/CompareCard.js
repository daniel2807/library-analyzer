import React, { useState, useEffect } from 'react';
// import DownloadChart from './DownloadChart';

import {
    Card,
    CardHeader,
    Tooltip,
    IconButton,
    CardContent,
    Grid,
    Typography,
    Box,
    CardActions,
    Button,
    Chip,
    Snackbar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    makeStyles,
} from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import {
    DeleteForever as DeleteIcon,
    GitHub as GitHubIcon,
    Star as StarIcon,
    GetApp as DownloadIcon,
    BugReport as OpenIssuesIcon,
    NewReleases as RealeasesIcon,
    Description as DescriptionIcon,
    ShowChart as ScoreIcon,
    FileCopyOutlined as CopyIcon,
    ExpandMore as ExpandMoreIcon,
    OfflineBolt as DependencieIcon,
    LocationOn as PinIcon,
    LocationOff as DontPinIcon,
} from '@material-ui/icons';

const useStyles = makeStyles({
    hideBorder: {
      '&.MuiPaper-elevation1': {
        boxShadow: 'none',
      },
      '&.MuiAccordion-root:before': {
          backgroundColor: 'white',
      },
    },
})

const getCardSubheader = (date, version, license, filesize) => {
    const releaseDate = new Date(date).toLocaleDateString();

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography variant='body1'>
                    Published: {releaseDate ? releaseDate : '-'} <br />
                    Version: {version ? version : '-'}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant='body1'>
                    License: {license ? license : '-'} <br />
                    Filesize: {filesize ? filesize : '-'}
                </Typography>
            </Grid>
        </Grid>
        
    )
}

const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />
}

const CompareCard = (props) => {
    const classes = useStyles();
    const {cardData, dropLibraryFunc, pinLibraryFunc, dontPinLibraryFunc} = props;
    const copyNpmDownloadLink = 'npm i ' + cardData.name;
    const copyYarnDownloadLink = 'yarn add ' + cardData.name;

    const [open, setOpen] = useState(false);
    const [clipboardAnswer, setClipboardAnswer] = useState('error');
    const [dependencies, setDependencies] = useState([]);

    useEffect(() => {
        if (cardData.dependencies) setDependencies(Object.keys(cardData.dependencies))
    }, [cardData.dependencies])

    const handleChipClick = (copyLink) => {
        navigator.clipboard.writeText(copyLink).then(function() {
            setOpen(true);
            setClipboardAnswer('success');
        }, function() {
            setOpen(true);
            setClipboardAnswer('error');
        })
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }

    return (
        <>
            <Card variant='outlined'>
                <CardHeader 
                    title={cardData.name}
                    subheader={getCardSubheader(cardData.creationDate, cardData.version, cardData.license, cardData.fileSize)}
                    action={
                        <>
                            <Tooltip title='pin library'>
                                <IconButton onClick={pinLibraryFunc}>
                                    <PinIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title='dont pin library'>
                                <IconButton onClick={dontPinLibraryFunc}>
                                    <DontPinIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title='drop library'>
                                <IconButton onClick={dropLibraryFunc}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                />

                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='body1' component='div'>
                                <Tooltip title='Description'>
                                    <DescriptionIcon style={{height: 15}}/>
                                </Tooltip>
                            </Typography>
                            <Typography variant='body2' style={{wordWrap: 'break-word', marginLeft: '15px', marginRight: '15px'}}>
                                {cardData.description}
                            </Typography>
                        </Grid>

                        {/*
                        <DownloadChart 
                            labels={cardData.downloadRange.map(downloads => downloads.day)} 
                            values={cardData.downloadRange.map(downloads => downloads.downloads)}
                        />
                        */}

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'>
                                <Box fontWeight='fontWeightBold'>
                                    <DownloadIcon style={{height: 15}}/>Downloads last week:
                                </Box>
                            </Typography>
                            <Typography variant='body2' style={{marginLeft: '15px'}}>
                                {cardData.downloads >= 0 ? cardData.downloads : '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'>
                                <Box fontWeight='fontWeightBold'>
                                    <StarIcon style={{height: 15}}/>Stars on GitHub:
                                </Box>
                            </Typography>
                            <Typography variant='body2' style={{marginLeft: '15px'}}>
                                {cardData.stars >= 0 ? cardData.stars : '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'>
                                <Box fontWeight='fontWeightBold'>
                                    <DependencieIcon style={{height: 15}}/>Dependencies:
                                </Box>
                            </Typography>
                        
                            <Accordion className={classes.hideBorder}>
                                <Tooltip title='show depency names'>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        {dependencies.length}
                                    </AccordionSummary>
                                </Tooltip>
                                <AccordionDetails>
                                    <List component='nav'>
                                        {dependencies.map(curr =>
                                            <ListItem key={curr}>
                                                {curr}
                                            </ListItem>
                                        )}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'>
                                <Box fontWeight='fontWeightBold'>
                                    <OpenIssuesIcon style={{height: 15}}/>Open Issues:
                                </Box>
                            </Typography>
                            <Typography variant='body2' style={{marginLeft: '15px'}}>
                                {cardData.openIssues >= 0 ? cardData.openIssues : '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'>
                                <Box fontWeight='fontWeightBold'>
                                    <RealeasesIcon style={{height: 15}}/>Releases in the last month:
                                </Box>
                            </Typography>
                            <Typography variant='body2' style={{marginLeft: '15px'}}>
                                {cardData.releases >= 0 ? cardData.releases : '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'>
                                <Box fontWeight='fontWeightBold'>
                                    <ScoreIcon style={{height: 15}}/>Finalscore:
                                </Box>
                            </Typography>
                            <Typography variant='body2' style={{marginLeft: '15px'}}>
                                {Number((cardData.finalScore).toFixed(3))}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>

                <CardActions>
                    <Tooltip title='show library on GitHub'>
                        <IconButton color='primary' onClick={() => console.log(cardData.gitLink)}>
                            <GitHubIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='show library on npm'>
                        <Button color='primary'>
                            npm
                        </Button>
                    </Tooltip>

                    <Tooltip title='copy command to clipboard'>
                        <Chip
                            label={copyNpmDownloadLink}
                            variant='outlined'
                            onClick={() => handleChipClick(copyNpmDownloadLink)}
                            onDelete={() => handleChipClick(copyNpmDownloadLink)}
                            deleteIcon={<CopyIcon />}
                        />
                    </Tooltip>

                    <Tooltip title='copy command to clipboard'>
                        <Chip
                            label={copyYarnDownloadLink}
                            variant='outlined'
                            onClick={() => handleChipClick(copyYarnDownloadLink)}
                            onDelete={() => handleChipClick(copyYarnDownloadLink)}
                            deleteIcon={<CopyIcon />}
                        />
                    </Tooltip>
                </CardActions>
            </Card>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={clipboardAnswer}>
                    Link copied to clipboard
                </Alert>
            </Snackbar>
        </>
    )
}

export default CompareCard;