import { IndividualInfo } from "./cupidalgo";


const marketingString = "\n\nIf you haven’t, please join our AKCSE Discord channel, Instagram and Facebook as we post our events on them.\n\nAKCSE Discord Link: https://discord.gg/hJG6BUe7B4\nAKCSE Instagram Link: https://www.instagram.com/akcse_uw/\nAKCSE Facebook Link:https://www.facebook.com/uw.akcse\n"

export function generateEmails(matchedCouples: IndividualInfo[][], unmatchedIndividuals: IndividualInfo[]) {
    let successString = '';
    let unmatchedString = '';
    
    matchedCouples.forEach((match, index) => {
        const firstPerson = match[0];
        const secondPerson = match[1];

        successString +=    "==================== Match #" + index  + " ====================\n\n"
        successString +=    "====== Send to:   " + firstPerson.email + "  =======\n\n";
        successString += "Congratulations! \n\nWe found your perfect match!\nBased on your preferences and personality traits, our unique Cupid’s Algorithm has matched you with "+ secondPerson.name + ".\nNow, it is your turn to shoot the arrow and write the next chapter of your life.\nAll members of AKCSE wish you good luck.\nYour match’s IG handle is @" + secondPerson.instagram + ". \nSo what are you waiting for? Shoot your shot!\n\nAKCSE UW";
        successString += "\n\n축하합니다, 신청자분의 “천생연분”을 찾았습니다!\n개인의 취향과 성향을 바탕으로 만든 악세의 Cupid’s Algorithm이 신청자분을" + secondPerson.name + "님과 연결 시켰다고 합니다.\n매치 된 상대방의 인스타그램 아이디는 @" + secondPerson.instagram + " 입니다.\n주저하지 말고 신청자분의 큐피드 화살로 천생연분을 잡으세요!\n저희 모든 악세 임원들이 응원합니다 :)\n\n악세 드림"
        successString += marketingString

        successString +=    "\n\n====== Send to:   " + secondPerson.email + "  =======\n\n";
        successString += "Congratulations! \n\nWe found your perfect match!\nBased on your preferences and personality traits, our unique Cupid’s Algorithm has matched you with "+ firstPerson.name + ".\nNow, it is your turn to shoot the arrow and write the next chapter of your life.\nAll members of AKCSE wish you good luck.\nYour match’s IG handle is @" + firstPerson.instagram + ". \nSo what are you waiting for? Shoot your shot!\n\nAKCSE UW";
        successString += "\n\n축하합니다, 신청자분의 “천생연분”을 찾았습니다!\n개인의 취향과 성향을 바탕으로 만든 악세의 Cupid’s Algorithm이 신청자분을" + firstPerson.name + "님과 연결 시켰다고 합니다.\n매치 된 상대방의 인스타그램 아이디는 @" + firstPerson.instagram + " 입니다.\n주저하지 말고 신청자분의 큐피드 화살로 천생연분을 잡으세요!\n저희 모든 악세 임원들이 응원합니다 :)\n\n악세 드림"
        successString += marketingString
        
        successString += "\n\n\n==================================================\n\n\n"
    });

    // console.log(successString)

    unmatchedString +=  "============UNMATCHED=============\n\n";
    unmatchedIndividuals.forEach((individual) => {
        unmatchedString +=    "=====For    " + individual.email + "  =======\n\n";
        unmatchedString += "Hi " + individual.name + ",\n" + "Thank you for taking the time to participate in our Cupid\’s Algorithm event.\n" + "With so many participants, the algorithm had to make some tough decisions, and unfortunately, we were not able to find your match." + "We are hopeful that our Cupid’s Algorithm event continues and, in the future, find you the perfect match.\nWe sincerely apologize for the result. We will always wish you all the best in finding your Valentine’s match.\nWe appreciate your participation, and we look forward to seeing you at our upcoming events.\nThank you."
        // add Korean
        unmatchedString += "\n\n안녕하세요 " + individual.name +"님, \n" + "악세 Cupid’s Algorithm 이벤트에 신청해 주셔서 감사합니다.\n" + "예상보다 많은 신청자로 인해 안타깝게도 이번 이벤트에서는 귀하의 매치를 구하지 못하였습니다.\n다음 기회엔 신청자님에게도 큐피드의 화살이 꼭! 날아올 수 있도록 저희 악세가 응원하겠습니다.\n이번 악세 Cupid’s Algorithm 신청해 주셔서 감사하고, 다음 새로운 이벤트로 찾아 뵙겠습니다.\n감사합니다."
        unmatchedString += "\n\n\n==================================================\n\n\n"
    })
    
    // console.log(unmatchedString)

    return successString + "\n\n" + unmatchedString
}




