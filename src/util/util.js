function firebaseGetValidator(result, index) {
  if (result.docs.length) {
    return result.docs[0].data();
  } else {
    return [];
  }
}

export default { firebaseGetValidator };
