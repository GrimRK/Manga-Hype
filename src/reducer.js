export const initialState = {
  user: null,
  token: null,
  open: true,
  width: null,
  tags: null,
  mangaInfo: null,
  popular: null,
  comedy: null,
  action: null,
  manhwa: null,
  currentComponent: null,
};

const reducer = (state, action) => {
  // console.log("Action : ", action);
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.token,
      };
    case "SET_OPEN":
      return {
        ...state,
        open: action.open,
      };
    case "SET_WIDTH":
      return {
        ...state,
        width: action.width,
      };
    case "SET_CURRENTCOMPONENT":
      return {
        ...state,
        currentComponent: action.currentComponent,
      };
    case "SET_TAGS":
      return {
        ...state,
        tags: action.tags,
      };
    case "SET_MANGAINFO":
      return {
        ...state,
        mangaInfo: action.mangaInfo,
      };

    case "SET_POPULAR":
      return {
        ...state,
        popular: action.popular,
      };
    case "SET_COMEDY":
      return {
        ...state,
        comedy: action.comedy,
      };
    case "SET_ACTION":
      return {
        ...state,
        action: action.action,
      };
    case "SET_ROMANCE":
      return {
        ...state,
        romance: action.romance,
      };
    default:
      return state;
  }
};

export default reducer;
