const axios = require('axios');
const linkify = require('linkify-it')();
const tlds = require('linkify-it-tlds');
const fs = require('fs');
const md = require('markdown-it')({
    html: true,
});

linkify
    .tlds(tlds)                     // Reload with full tlds list
    .tlds('onion', true)            // Add unofficial `.onion` domain
    .add('git:', 'http:')           // Add `git:` protocol as "alias"
    .add('ftp:', null)              // Disable `ftp:` protocol
    .set({ fuzzyIP: true }); 

const notFoundedPackagesFile = 'packages_not_found.json';
const notFoundedPackagesArray = [];
let notFoundedPackagesObject = {name: notFoundedPackagesArray};
let librarySummaryObject;
const librarySummaryArray = [];

console.log('\x1b[41m%s\x1b[0m', 'Start');

function getListOfUrls() {
    axios.get('https://raw.githubusercontent.com/sindresorhus/awesome-nodejs/master/readme.md')
        .then(response => {
            const rawGitubContent = md.renderInline(response.data);
            const listOfLinks = linkify.match(rawGitubContent);

            listOfLinks.forEach(link => {
                if(link.url.startsWith('https://github.com')) {
                    const gitRepo = link.url.split('https://github.com/');
                    const npmRepo = gitRepo[1].split('/')
                    const npmIoApiUrl = 'https://api.npms.io/v2/package/' + npmRepo[1];
                    const npmWeeklyDownloadsUrl = 'https://api.npmjs.org/downloads/range/last-month/' + npmRepo[1];
                    const packageFilename = 'files/' + npmRepo[1] + '.json';
                    // const gitApiUrl = 'http://api.github.com/repos/' + gitRepo[1];
                    
                    // check if file exist if not create else save data to variable
                    if(!fs.existsSync(notFoundedPackagesFile)) {
                        fs.writeFile(notFoundedPackagesFile, JSON.stringify(notFoundedPackagesObject, null, 4), 'utf-8', (err) => { 
                            if (err) throw err;
                        })

                    }else {
                        fs.stat(notFoundedPackagesFile, (err, stats) => {
                            if (err) throw err;
                            const time = (new Date().getTime() - new Date(stats.mtime).getTime()) / 86400000; //output one day

                            if(time >= 1) {
                                fs.writeFile(notFoundedPackagesFile, JSON.stringify(notFoundedPackagesObject, null, 4), 'utf-8', (err) => { 
                                    if (err) throw err;
                                })
                            }else {
                                fs.readFile(notFoundedPackagesFile, (err, data) => {
                                    if (err) throw err;
                                    notFoundedPackagesObject = JSON.parse(data);
                                })
                            }
                        })
                    }

                    //  check if repo file exist if not check if package exist and search for it
                    if(fs.existsSync(packageFilename)) {
                        // get last change timestamp
                        fs.stat(packageFilename, (err, stats) => {
                            if (err) throw err;
                            const time = (new Date().getTime() - new Date(stats.mtime).getTime()) / 86400000; //output one day

                            // update files every day
                            if(time >= 0) {
                                searchPackage(npmIoApiUrl, npmWeeklyDownloadsUrl, npmRepo[1])
                                    .then(response => {
                                        if(response === 'saved') readPackageFile(packageFilename);
                                    })
                            }else {
                                readPackageFile(packageFilename);
                            }
                        })
                    
                    }else {
                        notFoundedPackagesObject.name.forEach(curr => {
                            if(!(curr === npmRepo[1])) searchPackage(npmIoApiUrl, npmWeeklyDownloadsUrl, npmRepo[1]);
                        })
                    }
                }
            });
        });
}

function searchPackage(searchUrl, downloadsUrl, repoName) {
    return new Promise(function(resolve) {
        axios.get(searchUrl)
            .then(packageResponse => {
                // axios.get(downloadsUrl)
                //     .then(downloadResponse => {
                //         const mergedData = {...packageResponse.data, ...downloadResponse.data};
                        // console.log(mergedData)
                        // create/update repo file
                        
                        fs.writeFile('files/' + repoName + '.json', JSON.stringify(packageResponse.data, null, 4), (err) => {
                            if(err) throw err;
                            resolve('saved');
                        });
                    // })
            })
            .catch(err => {
                // update not founded repos file
                notFoundedPackagesArray.push(repoName);
                notFoundedPackagesObject = {
                    name: notFoundedPackagesArray
                };
                fs.writeFile(notFoundedPackagesFile, JSON.stringify(notFoundedPackagesObject, null, 4), 'utf-8', (err) => {
                    if(err) throw err;
                })
                console.log('\x1b[41m%s\x1b[0m', 'package not found')
                resolve('package not found')
            })
    });
}

function readPackageFile(filename) {
    fs.readFile(filename, (err, data) => {
        if (err) throw err;
        const apiData = JSON.parse(data);
        const metadata = apiData.collected.metadata;
        const npmData = apiData.collected.npm;
        const githubData = apiData.collected.github;

        librarySummaryArray.push({
            'name': metadata.name,
            'version': metadata.version,
            'description': metadata.description,
            'license': metadata.license,
            'downloads': npmData.downloads[1].count,
            'dependencies': metadata.dependencies,
            'stars': (githubData ? githubData.starsCount : undefined),
            'openIssues': (githubData ? githubData.issues.openCount : undefined),
            'fileSize': (apiData.collected.source ? apiData.collected.source.files.testsSize : undefined),
            'releases': metadata.releases[0].count,
            'creationDate': metadata.date,
            'npmLink': metadata.links.npm,
            'gitLink': metadata.links.repository,
            'finalScore': apiData.score.final,
            // 'downloadRange': apiData.downloads,
        });
        
        librarySummaryArray.sort(compare);
        createSummaryOfTheLibraries();
    });
}

function createSummaryOfTheLibraries() {
    const summaryFile = '../src/summary_of_libraries.json';

    librarySummaryObject = {
        'libraries': librarySummaryArray
    }
    
    fs.writeFile(summaryFile, JSON.stringify(librarySummaryObject, null, 4), 'utf-8', (err) => { 
        if (err) throw err;
    });
}

function compare( a, b ) {
    if ( a.name < b.name )return -1;
    if ( a.name > b.name )return 1;
    return 0;
}

getListOfUrls();
