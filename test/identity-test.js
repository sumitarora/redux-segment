import * as test from 'tape';
import createStub from './segment-stub';
import segmentMiddleware from '../src/index';


test('Identify - userId', t => {
  // Arrange
  window.analytics = createStub();
  const noUserIdAction = {
    type: '@@SIGNUP',
    paylod: {
      email,
    },
    meta: {
      analytics: {
        type: 'IDENTITY',
        traits: {
          email,
        },
      },
    },
  };
  const withUserIdAction = {
    type: '@@SIGNUP',
    paylod: {
      id,
      email,
    },
    meta: {
      analytics: {
        type: 'IDENTITY',
        userId: 'id',
        traits: {
          email,
        },
      },
    },
  };

  // Act


  // Assert


  // Cleanup
  window.analytics = null;
});

test('Identify - traits', t => {
  // Arrange
  window.analytics = createStub();
  const action = {
    type: '@@SIGNIN_SUCCESS',
    paylod: {
      id,
      fistName,
      lastName,
      email,
    },
    meta: {
      analytics: {
        type: 'IDENTITY',
        userId: 'id',
        traits: {
          email,
          firstName,
          lastName,
        },
      },
    },
  };

  // Act


  // Assert


  // Cleanup
  window.analytics = null;
});

