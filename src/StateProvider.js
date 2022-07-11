import React, { createContext, useContext, useReducer } from "react";
const StateContext = createContext();

const StateProvider = ({ initialState, reducer, children }) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateProviderValue = () => useContext(StateContext);
export default StateProvider;
