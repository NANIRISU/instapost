import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          title,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data)
          if (data.error) {
            M.toast({ html: data.error, classes: "#d50000 red accent-4" });
          } else {
            M.toast({
              html: "createdpost successfully",
              classes: "#00c853 green accent-4",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instapost");
    data.append("cloud_name", "drlqvm95z");
    fetch("https://api.cloudinary.com/v1_1/drlqvm95z/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-filed"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="file-field input-field">
        <div className="btn  #2196f3 blue">
          <span>Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input
            className="file-path validate"
            type="text"
            placeholder="Select Image"
          />
        </div>
      </div>
      <button
        className="waves-effect waves-light btn  #2196f3 blue"
        onClick={() => postDetails()}
      >
        Submit
      </button>
    </div>
  );
};

export default CreatePost;
