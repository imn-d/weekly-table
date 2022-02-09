const letters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
];

export const random = () => {
  return (
    (new Date().getTime() / 1000) * Math.random() +
    letters[Math.floor(Math.random() * 10)]
  );
};
