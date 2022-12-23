const getExistingField = (key1: number | undefined, key2: number | undefined) => {
  return (key1 != undefined) ? key1 : key2;
};

export default getExistingField;
