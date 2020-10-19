import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import M from "materialize-css";

const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#ef5350 red lighten-1" });
      return;
    }
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data,"hello")

        if (data.error) {
          M.toast({ html: data.error, classes: "#d50000 red accent-4" });
        } else {
          //data.user.pic=''
          // console.log(data,"pic")
          // localStorage.setItem("jwt",data.token)
          // localStorage.setItem("user",JSON.stringify(data.user))
          // dispatch({type:"USER",payload:data.user})
          M.toast({ html: data.message, classes: "#00c853 green accent-4" });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instapost</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="waves-effect waves-light btn  #2196f3 blue"
          onClick={() => PostData()}
        >
          reset password
        </button>
      </div>
    </div>
  );
};
export default Reset;
