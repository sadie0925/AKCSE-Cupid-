import { writeFile } from 'fs';
import * as path from 'path';

import { MBTICompatibilityChart } from './mbtiCompatibility';

import excelToJson from 'convert-excel-to-json';
import { generateEmails } from './generateEmail';

const result = excelToJson({
    sourceFile: path.join(__dirname, '../FinalResponse.xlsx'),
    header: { // Skips row 1. Row 1 is header data
        rows: 1
    }
});

const maleIndividualInfoArr: IndividualInfo[] = [];
const femaleIndividualInfoArr: IndividualInfo[] = [];
const otherGenderIndividualInfoArr: IndividualInfo[] = [];

const lookingForMaleIndividualInfoArr: IndividualInfo[] = [];
const lookingForFemaleIndividualInfoArr: IndividualInfo[] = [];
const lookingForOtherGenderIndividualInfoArr: IndividualInfo[] = [];

result["Form Responses 1"].forEach(individual => {
    const individualInfo: IndividualInfo = {
        name: individual['B'],
        email: individual['C'],
        instagram: individual['E'],
        gender: individual['F'],
        age: individual['G'],
        preferredLanguage: individual['J'],
        mbti: individual['K'],
        pastRelationshipCount: individual['L'],
        firstImpression: individual['M'],
        homebody: individual['N'],
        loveAtFirstSight: individual['O'],
        openToMarriage: individual['P'],
        loveOrFriendship: individual['Q'],
        afterMeal: individual['R'],
        answeringQuestions: individual['S'],
        currentEvents: individual['T'],
        studyEnvironment: individual['U'],
        appearanceImportance: individual['V'],
        jobOfferPriority: individual['W'],
        drinkingAtSocialEvent: individual['X'],
        whiteLies: individual['Y'],
        mealLocationPreference: individual['Z'],
        lifestylePreference: individual['AA'],
        location: individual['AB'],
        routineOrNew: individual['AC'],
        valentineGift: individual['AD'],
        partnerGender: individual['AE'],
        ageCeiling: individual['AG'],
        ageFloor: individual['AH'],
        casualOrSerious: individual['AI'], 
        relationshipTypePreference: individual['AJ'],
        rankingRelationshipTypePreference: individual['AK'],
        rankingPastRelationshipCount: individual['AL'],
        contactPreference: individual['AM'],
        oppositeGenderBFFIsntProblem: individual['AN'],
        disagreementResolutionPreference: individual['AO'],
        contactFrequency: individual['AP'],
        rankingContactFrequency: individual['AQ'],
        meetFrequency: individual['AR'],
        loveLanguage: individual['AS'],
        dateCoursePreference: individual['AT'],
        anniversaryCelebrationFrequency: individual['AU'],
        anniversaryImportance: individual['AV'],
        firstDateSpending: individual['AW'],
        dutchPay: individual['AX'],
        firstDateStyle: individual['AY'],
        idealDateRoutine: individual['AZ'],
        ILYTime: individual['BA'], 
        publicAffection: individual['BB'], 
        PDAFriends: individual['BC'],
        adviceFromFriends: individual['BD'],
        disagreementResolution: individual['BE'],
        apologyAfterFight: individual['BF'],
        conversationPreference: individual['BG'],
        afterMatching: individual['BH'],
        taken: false,
    }

    if (individualInfo.gender === 'Male') {
        maleIndividualInfoArr.push(individualInfo);
    } else if (individualInfo.gender === 'Female') {
        femaleIndividualInfoArr.push(individualInfo);
    } else {
        otherGenderIndividualInfoArr.push(individualInfo);
    }

    if (individualInfo.partnerGender === 'Male') {
        lookingForMaleIndividualInfoArr.push(individualInfo);
    } else if (individualInfo.partnerGender === 'Female') {
        lookingForFemaleIndividualInfoArr.push(individualInfo);
    } else {
        lookingForOtherGenderIndividualInfoArr.push(individualInfo);
    }
});

const matchedCouplesArr: Array<Array<IndividualInfo>> = [];
const matchedCoupleNames: {firstPersonName: string, secondPersonName: string}[] = [];
const unmatchedIndividualArr: IndividualInfo[] = [];

function calculateTwoPeopleMatchPoints(targetPerson: IndividualInfo, potentialMatch: IndividualInfo): number {
    let matchPoint = 0;

    // Deal Breakers
    const targetPersonPartnerAgeCeiling = targetPerson.age + targetPerson.ageCeiling;
    const targetPersonPartnerAgeFloor = targetPerson.age - targetPerson.ageFloor;

    const potentialMatchPartnerAgeCeiling = potentialMatch.age + potentialMatch.ageCeiling;
    const potentialMatchPartnerAgeFloor = potentialMatch.age - potentialMatch.ageFloor;

    if ((targetPerson.age < potentialMatchPartnerAgeFloor || targetPerson.age > potentialMatchPartnerAgeCeiling) ||
        (potentialMatch.age < targetPersonPartnerAgeFloor || potentialMatch.age > targetPersonPartnerAgeCeiling)) {
        return matchPoint;
    }
    if ((targetPerson.gender != potentialMatch.partnerGender) ||
        (potentialMatch.gender != targetPerson.partnerGender)) {
        return matchPoint;
    }

    // Both are the same people
    if (targetPerson.name === potentialMatch.name) {
        return matchPoint;
    }

    // Second person already taken
    if (potentialMatch.taken) {
        return matchPoint;
    }

    // MBTI compatibility point
    matchPoint += MBTICompatibilityChart[targetPerson.mbti][potentialMatch.mbti] - 2; // scale of -1 to 3

    // Preferred Language
    if ((targetPerson.preferredLanguage === potentialMatch.preferredLanguage) ||
        (targetPerson.preferredLanguage === 'Fluent in both') ||
        (potentialMatch.preferredLanguage === 'Fluent in both')) {
        matchPoint += 1;
    }

    // [RANK] Past relationship count
    if (targetPerson.rankingPastRelationshipCount === potentialMatch.rankingPastRelationshipCount 
        && targetPerson.pastRelationshipCount === potentialMatch.pastRelationshipCount
        ) {
        matchPoint += targetPerson.rankingPastRelationshipCount
    } else if (targetPerson.pastRelationshipCount === potentialMatch.pastRelationshipCount) {
        matchPoint += 1;
    }
    // First impression
    if (targetPerson.firstImpression === potentialMatch.firstImpression) {
        matchPoint += 1;
    }

    // Stay home or go out
    if (targetPerson.homebody === potentialMatch.homebody) {
        matchPoint += 1;
    }

    // Love at first sight
    if (targetPerson.loveAtFirstSight === potentialMatch.loveAtFirstSight) {
        matchPoint += 1;
    }

    // Open to marriage
    if (targetPerson.openToMarriage === potentialMatch.openToMarriage) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.loveOrFriendship === potentialMatch.loveOrFriendship) {
        matchPoint += 1;
    }

    // Washing dishes after a meal
    if (targetPerson.afterMeal === potentialMatch.afterMeal) {
        matchPoint += 1;
    }

    // How to answer questions
    if (targetPerson.answeringQuestions === potentialMatch.answeringQuestions) {
        matchPoint += 1;
    }

    // Current events
    if (targetPerson.currentEvents === potentialMatch.currentEvents) {
        matchPoint += 1;
    }

    // Messy or clean study environment
    if (targetPerson.studyEnvironment === potentialMatch.studyEnvironment) {
        matchPoint += 1;
    }

    // Appearance importance
    if (targetPerson.appearanceImportance === potentialMatch.appearanceImportance) {
        matchPoint += 1;
    }

    // Priority in job offer
    if (targetPerson.jobOfferPriority === potentialMatch.jobOfferPriority) {
        matchPoint += 1;
    }

    // Drinking at social event
    if (targetPerson.drinkingAtSocialEvent === potentialMatch.drinkingAtSocialEvent) {
        matchPoint += 1;
    }

    // White lies
    if (targetPerson.whiteLies === potentialMatch.whiteLies) {
        matchPoint += 1;
    }

    // Eating in or out
    if (targetPerson.mealLocationPreference === potentialMatch.mealLocationPreference) {
        matchPoint += 1;
    }

    // Night owl or early bird
    if (targetPerson.lifestylePreference === potentialMatch.lifestylePreference) {
        matchPoint += 1;
    }

    // Location
    if (targetPerson.location === potentialMatch.location) {
        matchPoint += 1;
    }

    // Trying something new or going with routine
    if (targetPerson.routineOrNew === potentialMatch.routineOrNew) {
        matchPoint += 1;
    }

    // Valentine gift preference
    if (targetPerson.valentineGift === potentialMatch.valentineGift) {
        matchPoint += 1;
    }

    // Looking for casual or serious
    if (targetPerson.casualOrSerious === potentialMatch.casualOrSerious) {
        matchPoint += 1;
    }

    // [RANK] Relationship type preference - friendly or romantic
    if (targetPerson.rankingRelationshipTypePreference === potentialMatch.rankingRelationshipTypePreference 
        && targetPerson.relationshipTypePreference === potentialMatch.relationshipTypePreference) {
        matchPoint += targetPerson.rankingRelationshipTypePreference;
    } else if (targetPerson.rankingRelationshipTypePreference === potentialMatch.rankingRelationshipTypePreference) { 
        matchPoint += 1;
    }

    // 
    if (targetPerson.oppositeGenderBFFIsntProblem === potentialMatch.oppositeGenderBFFIsntProblem) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.disagreementResolutionPreference === potentialMatch.disagreementResolutionPreference) {
        matchPoint += 1;
    }

    // [RANK] How often to contact
    if (targetPerson.rankingContactFrequency === potentialMatch.rankingContactFrequency 
        && targetPerson.contactFrequency === potentialMatch.contactFrequency) {        
        matchPoint += targetPerson.rankingContactFrequency;
    } else if (targetPerson.rankingContactFrequency === potentialMatch.rankingContactFrequency) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.meetFrequency === potentialMatch.meetFrequency) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.loveLanguage === potentialMatch.loveLanguage) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.dateCoursePreference === potentialMatch.dateCoursePreference) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.anniversaryCelebrationFrequency === potentialMatch.anniversaryCelebrationFrequency) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.anniversaryImportance === potentialMatch.anniversaryImportance) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.firstDateSpending === potentialMatch.firstDateSpending) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.dutchPay === potentialMatch.dutchPay) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.firstDateStyle === potentialMatch.firstDateStyle) {
        matchPoint += 1;
    }

    // Ideal date routine
    if (targetPerson.idealDateRoutine === potentialMatch.idealDateRoutine) {
        matchPoint += 1;
    }

    // Duration to say ILY
    if (targetPerson.ILYTime === potentialMatch.ILYTime) {
        matchPoint += 1;
    }

    // PDA
    if (targetPerson.publicAffection === potentialMatch.publicAffection) {
        matchPoint += 1;
    }

    // Comfort doing PDA in front of friends
    if (targetPerson.PDAFriends === potentialMatch.PDAFriends) {
        matchPoint += 1;
    }

    // Seek advice from friends
    if (targetPerson.adviceFromFriends === potentialMatch.adviceFromFriends) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.disagreementResolution === potentialMatch.disagreementResolution) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.apologyAfterFight === potentialMatch.apologyAfterFight) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.conversationPreference === potentialMatch.relationshipTypePreference) {
        matchPoint += 1;
    }

    // 
    if (targetPerson.afterMatching === potentialMatch.afterMatching) {
        matchPoint += 1;
    }

    return matchPoint;
}

function findMatches(targetPerson: IndividualInfo, potentialMatchesArr: IndividualInfo[]): void {
    if (targetPerson.taken) {
        return;
    }

    let match: IndividualInfo | undefined = undefined;
    let maxMatchPointSoFar = 0;

    potentialMatchesArr.forEach(potentialMatch => {
        const matchPoint = calculateTwoPeopleMatchPoints(targetPerson, potentialMatch);

        if (matchPoint > 0 && matchPoint > maxMatchPointSoFar) {
            match = potentialMatch;
            maxMatchPointSoFar = matchPoint;
        }
    })

    if (match != undefined) {
        matchedCoupleNames.push({firstPersonName: targetPerson.name, secondPersonName: match.name});
        matchedCouplesArr.push([targetPerson, match])
        targetPerson.taken = true;
        match.taken = true;
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
    unmatchedIndividualString += '\n#' + ind + ': ' + individual.name;
})

const resultReportString = successfulMatchesString + '\n\n' + unmatchedIndividualString;
console.log(resultReportString);

writeFile(path.join(__dirname, '../report.txt'), successfulMatchesString + '\n\n' + unmatchedIndividualString, err => {
    if (err) throw err;
})

writeFile(path.join(__dirname, '../email.txt'), generateEmails(matchedCouplesArr, unmatchedIndividualArr), err => {
    if (err) throw err;
})



export type IndividualInfo = {
    name: string,
    email: string,
    instagram: string,
    gender: string,
    age: number,
    preferredLanguage: string
    mbti: string,
    pastRelationshipCount: number, // how many previous relationships
    firstImpression: string, // first impression
    homebody: string,
    loveAtFirstSight: string,
    openToMarriage: string,
    loveOrFriendship: string,
    afterMeal: string, // washing dishes after a meal
    answeringQuestions: string, 
    currentEvents: string,
    studyEnvironment: string, // messy or clean when studying
    appearanceImportance: string, 
    jobOfferPriority: string,
    drinkingAtSocialEvent: string,
    whiteLies: string,
    mealLocationPreference: string,
    lifestylePreference: string, // night own or early bird
    location: string, // canada or korea
    routineOrNew: string, // adventurous or routine
    valentineGift: string,
    partnerGender: string, // DEAL BREAKER
    ageCeiling: number, // DEAL BREAKER
    ageFloor: number, // DEAL BREAKER
    casualOrSerious: string,
    relationshipTypePreference: string, // friendly or romantic
    rankingRelationshipTypePreference: number, // RANK
    rankingPastRelationshipCount: number, // RANK
    contactPreference: string, // phone or text
    oppositeGenderBFFIsntProblem: string, 
    disagreementResolutionPreference: string,
    contactFrequency: string,
    rankingContactFrequency: number, // RANK
    meetFrequency: string, // how often do you want to meet
    loveLanguage: string, 
    dateCoursePreference: string, // spontaneous or planned
    anniversaryCelebrationFrequency: string,
    anniversaryImportance: string,
    firstDateSpending: string,
    dutchPay: string,
    firstDateStyle: string, // active or deep talk
    idealDateRoutine: string,
    ILYTime: string,
    publicAffection: string,
    PDAFriends: string, // are you comfortable doing PDA in front of friends
    adviceFromFriends: string,
    disagreementResolution: string,
    apologyAfterFight: string,
    conversationPreference: string, // lovey dovey or calm
    afterMatching: string, // get to know through text or in person
    taken: boolean,
}
