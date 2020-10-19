import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialstate } from "./reducers/userReducer";
import UserProfile from "./components/screens/Userprofile";
import SubscribedUserPost from "./components/screens/SubscribesUserPosts";
import Reset from "./components/screens/Reset";
import NewPassowrd from "./components/screens/NewPassword";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  // console.log(state,"before")
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // localStorage.setItem("user",JSON.stringify({}))

    // console.log(user)
    if (user) {
      // console.log(user,"user-persent")

      dispatch({ type: "USER", payload: user });
      //  history.push('/')
    } else {
      if (!history.location.pathname.startsWith("/reset"))
        history.push("/signin");
    }
  }, []);
  // console.log(state,"after")
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/signin">
        <Signin />
      </Route>

      <Route path="/Signup">
        <Signup />
      </Route>

      <Route exact path="/Profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPost />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassowrd />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialstate);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
