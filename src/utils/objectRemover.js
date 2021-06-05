export const objectRemover = (arrayToRemove, object) => {
  arrayToRemove.forEach(function (key) {
    delete object[key];
  });
  return object;
};
