import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import M from "materialize-css";

const Signin = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const { token } = useParams();

  console.log(token);

  const PostData = () => {
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
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
          type="password"
          placeholder="enter a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="waves-effect waves-light btn  #2196f3 blue"
          onClick={() => PostData()}
        >
          Resetpassword
        </button>
      </div>
    </div>
  );
};
export default Signin;
