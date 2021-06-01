const { queryString } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Brenno',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Brenno&profession=developer');
  });

  it('should create a valid query string even when an array is passed as value', () => {
    const obj = {
      name: 'Brenno',
      abilities: ['JS', 'TDD'],
    };

    expect(queryString(obj)).toBe('name=Brenno&abilities=JS,TDD');
  });

  it('throw an error when an object is passed as value', () => {
    const obj = {
      name: 'Brenno',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    };

    expect(() => {
      queryString(obj);
    }).toThrowError();
  });
});

// describe('Query string to object', () => {

// });
