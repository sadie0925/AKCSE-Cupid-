import { writeFile } from 'fs';
import * as path from 'path';
import excelToJson from 'convert-excel-to-json';
import { generateEmails } from './generateEmail';
import { qi } from './questionIndices';

const result = excelToJson({
    sourceFile: path.join(__dirname, '../CupidAlgoTestData.xlsx'),
    header: { // Skips row 1. Row 1 is header data
        rows: 1
    }
});

const maleIndividualInfoArr: Array<Array<String>> = [];
const femaleIndividualInfoArr: Array<Array<String>>  = [];
const otherGenderIndividualInfoArr: Array<Array<String>>  = [];

const lookingForMaleIndividualInfoArr: Array<Array<String>>  = [];
const lookingForFemaleIndividualInfoArr: Array<Array<String>>  = [];
const lookingForOtherGenderIndividualInfoArr: Array<Array<String>>  = [];

result["Form Responses 1"].forEach((person) => {

    if (person[qi.gender] === 'Male') {
        maleIndividualInfoArr.push(person)
    } else if (person[qi.gender] === 'Female') {
        femaleIndividualInfoArr.push(person)
    } else {
        otherGenderIndividualInfoArr.push(person)
    }

    if (person[qi.lookingForGender] === 'Male') {
        lookingForMaleIndividualInfoArr.push(person)
    } else if (person[qi.lookingForGender] === 'Female') {
        lookingForFemaleIndividualInfoArr.push(person)
    } else {
        lookingForOtherGenderIndividualInfoArr.push(person)
    }
})

const matchedCouplesArr: Array<Array<Array<String>>> = [];
const matchedCoupleNames: {firstPersonName: string, secondPersonName: string}[] = [];
const matchedIndividualArr: Array<String> = [];
const unmatchedIndividualArr: Array<Array<String>> = [];

function calculateTwoPeopleMatchPoints(targetPerson: Array<String>, potentialMatch: Array<String>): number {
    let matchPoint = 0;

    // Deal Breakers

    // Looking For Gender
    if (targetPerson[qi.gender] !== potentialMatch[qi.lookingForGender] || targetPerson[qi.lookingForGender] !== potentialMatch[qi.gender]) {
        return matchPoint
    }

    // Age range for target person
    const targetPersonAgeInfo: Array<number> = [targetPerson[qi.age] - targetPerson[qi.ageFloor], targetPerson[qi.age], targetPerson[qi.age] + targetPerson[qi.ageCeiling]]
    const potentialMatchAgeInfo: Array<number> = [potentialMatch[qi.age] - potentialMatch[qi.ageFloor], potentialMatch[qi.age], potentialMatch[qi.age] + potentialMatch[qi.ageCeiling]]

    if ((targetPersonAgeInfo[1] < potentialMatchAgeInfo[0] && potentialMatchAgeInfo[2] < targetPersonAgeInfo[1]) ||
        (potentialMatchAgeInfo[1] < targetPersonAgeInfo[0] && targetPersonAgeInfo[2] < potentialMatchAgeInfo[1])) {
        return matchPoint
    }

    // Both are the same people
    if (targetPerson[qi.name] === potentialMatch[qi.name]) {
        return matchPoint;
    }

    // Second person already taken
    if (matchedIndividualArr.includes(potentialMatch[qi.name])) {
        return matchPoint;
    }

    const keysToSkip = [qi.timestamp, qi.name, qi.email, qi.studentNumber, qi.ig, qi.gender,
                        qi.age, qi.yearOfStudy, qi.faculty, qi.yearOfEnrol, qi.whyOther];
    const arrOfKeys = Object.keys(targetPerson)

    /*  WE CAN EDIT THIS PART OF THE CODE FOR CHANGING POINTS FOR EACH QUESTION  */
    arrOfKeys.forEach(key => {
        if (!keysToSkip.includes(key)) {
            // Here is a condition statement for questions that we want to give matchPoints to if the answer
            // between the person and potential match are the same (e.g. they are both night owls --> better match)
            if (targetPerson[key] === potentialMatch[key]) {
                matchPoint += 1
            }

            // We can think of the other nitty gritty later, but for now, we need to think of a solution for Question 15!
            // Question 15 is a ranking question which is split into five different indices:
            // qi.valueFirst, qi.valueSecond, qi.valueThird, qi.valueFourth, qi.valueFifth
            // I would like for you to figure out the best way to assess these rankings between the two individuals
            // and write condition statements to affect the matchPoint score.

            // BTW, if you are running short on time, do not feel pressured to tell us as we can find a way to figure it out!

            // Please include the condition statements below!
                



        }
    })
    
    return matchPoint;
}

function findMatches(targetPerson: Array<String>, potentialMatchesArr: Array<Array<String>>): void {

    if (matchedIndividualArr.includes(targetPerson[qi.name])) {
        return;
    }

    let match: Array<String> | undefined = undefined;
    let maxMatchPointSoFar = 0;

    potentialMatchesArr.forEach(potentialMatch => {
        const matchPoint = calculateTwoPeopleMatchPoints(targetPerson, potentialMatch);

        if (matchPoint > 0 && matchPoint > maxMatchPointSoFar) {
            match = potentialMatch;
            maxMatchPointSoFar = matchPoint;
        }
    })

    if (match != undefined) {
        matchedCoupleNames.push({firstPersonName: targetPerson[qi.name], secondPersonName: match[qi.name]});
        matchedCouplesArr.push([targetPerson, match])
        matchedIndividualArr.push(targetPerson[qi.name])
        matchedIndividualArr.push(match[qi.name])
    } else {
        unmatchedIndividualArr.push(targetPerson);
    }
}

lookingForOtherGenderIndividualInfoArr.forEach(targetPerson => {
    findMatches(targetPerson, otherGenderIndividualInfoArr);
});

lookingForMaleIndividualInfoArr.forEach(targetPerson => {
    findMatches(targetPerson, maleIndividualInfoArr);
});

lookingForFemaleIndividualInfoArr.forEach(targetPerson => {
    findMatches(targetPerson, femaleIndividualInfoArr);
});

const fs = require('fs');

let successfulMatchesString: string = 'Total of ' + matchedCoupleNames.length + ' Matches Found:';
let unmatchedIndividualString: string = `Total of ` + unmatchedIndividualArr.length + ' Unmatched Individuals:';

matchedCoupleNames.forEach((match, ind) => {
    successfulMatchesString += '\nMatch #' + ind + ': ' + match.firstPersonName + " && " + match.secondPersonName; 
});

unmatchedIndividualArr.forEach((individual, ind) => {
    unmatchedIndividualString += '\n#' + ind + ': ' + individual[qi.name];
})

const resultReportString = successfulMatchesString + '\n\n' + unmatchedIndividualString;
console.log(resultReportString);
console.log('hehexd')

writeFile(path.join(__dirname, '../report.txt'), successfulMatchesString + '\n\n' + unmatchedIndividualString, err => {
    if (err) throw err;
})

writeFile(path.join(__dirname, '../email.txt'), generateEmails(matchedCouplesArr, unmatchedIndividualArr), err => {
    if (err) throw err;
})