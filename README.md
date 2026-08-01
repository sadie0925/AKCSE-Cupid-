# AkcseCupidAlgo

This is a simple app used for AKCSE's cupid algorithm event.

It uses an excel sheet exported from google forms and matches people based on the answers to the google form.

It uses a greedy matching strategy: each participant is paired with the highest-scoring eligible person available when they are processed. This does not guarantee the maximum possible number of matches or the globally best set of matches; input order can affect the result.

For example, assume 4 people, A B C D. A - B is a match and C - D is a match. A - D may be a better match than A - B, but since A is already matched to B, A - D match will not be created.

# Pre-reqs

NPM version: 8.3.1 or higher

Node version: 16.14.0 or higher

## How to clone
Create a new directory for the repo

cd into the new directory, and run `git clone https://github.com/TaeYeopKim/akcseCupidAlgo.git`

```
mkdir newDir
cd newDir
git clone https://github.com/TaeYeopKim/akcseCupidAlgo.git
```

## How to run
1. cd into `akcseCupidAlgo` directory.

2. run `npm install`(you must have npm installed for this step)

3. Export the current Google Form responses as `FinalResponse.xlsx` and place it in the project directory. Run `npm run start` to create `report.txt` and `email.txt`. You can instead pass a filename after `--`. The workbook must have a worksheet named `Form Responses 1` and use the current form's column layout.

```
cd akcseCupidAlgo
npm install
npm run start
# or
npm run start -- MyResponses.xlsx
```

`CupidAlgoTestData.xlsx` is retained as an old-form reference dataset. It does not use the column layout expected by the current algorithm and cannot be used as an input without a separate legacy mapping.

## Possible improvements
1. Currently, a person can only have one gender that they want to match to. Next year, google forms may change so that a person can have multiple genders that they are ok matching with(for example, person A can indicate he/she is ok matching with either a male or a female). Current code does not support this.

2. Code cleanup.

3. Consider replacing the greedy matcher with a global matching algorithm if maximizing the number or total quality of pairs is required.
