//The reducer is a pure function that takes the previous state and an action, and returns the next state. (previousState, action) => nextState. It's called a reducer because it's the type of function you would pass to Array.

export const initialstate = null;

export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if ((action.type = "UPDATEPIC")) {
    return {
      ...state,
      pic: action.payload,
    };
  }
  return state;
};
