const { queryString } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Brenno',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Brenno&profession=developer');
  });
});

// describe('Query string to object', () => {

// });
