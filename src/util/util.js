function firebaseGetValidator(result, index) {
  if (result.docs.length) {
    return result.docs[0].data();
  } else {
    return [];
  }
}

function manipulateFeedbackQuestions(payload) {
  payload.questionAndAnswers.forEach(question => {
    payload[question.questionId] = question.answer;
  }); 
}

export default { firebaseGetValidator, manipulateFeedbackQuestions };
