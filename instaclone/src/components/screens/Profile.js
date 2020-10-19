import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Profile = (props) => {
  const [data, setData] = useState([]);
  //const {state,dispatch} = useContext(UserContext)
  const [mypics, setPics] = useState([]);
  const [galleryview, setGalleryview] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  // console.log(state,"before-profile")
  const [image, setImage] = useState("");
  //   const [url,setUrl]= useState()
  //  console.log(state)
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
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
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              var user = JSON.parse(localStorage.getItem("user"));
              user.pic = result.pic;
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );

              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //  console.log(state,"after-upload")
              // window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    updatePhoto(fileUploaded);
  };
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "like");
        const newData = data.map((item) => {
          if (item._id === result._id) {
            item.likes = result.likes;
            return item;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            item.likes = result.likes;
            return item;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id.toString() === result._id.toString()) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "6px 0px",
          borderBottom: "2px solid black",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "loading"}
              alt="error"
            />
          </div>

          <div>
            <h4>{state ? state.name : "loading"} </h4>
            <h6>{state ? state.email : "loading"} </h6>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "110%",
              }}
            >
              <h6>{mypics.length} posts</h6>
              <h6>{state ? state.followers.length : "0"} follwers</h6>
              <h6>{state ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>

        {/* <button class="upload pic update #blue"onChange={(e)=>updatePhoto(e.target.files[0])}  type="button"  >
                updatephoto
               <input  type="file" name="fileupload" hidden />
             </button> */}

        <button onClick={handleClick} className="upload">
          Upload a file
        </button>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {/* <div className="upload file-field input-field">
          <div className="btn  #2196f3 blue">
            <span>updatephoto <i></i> </span>
        <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
          
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" placeholder="Select Image" hidden />
      </div>
    </div> */}
      </div>

      <button
        onClick={() => setGalleryview(true)}
        style={{ marginLeft: "80px", backgroundColor: "white", color: "black" }}
      >
        <i class="material-icons">grid_on</i>
      </button>
      <button
        onClick={() => setGalleryview(false)}
        style={{ marginLeft: "300px", backgroundColor: "white" }}
      >
        <i class="material-icons">format_align_justify</i>
      </button>
      <div
        className="line"
        style={{
          margin: "2px 0px",
          borderBottom: "2px solid black",
          color: "blue",
        }}
      ></div>
      {mypics !== null && mypics.length > 0 ? (
        <div>
          {galleryview ? (
            <div className="gallery">
              {mypics.map((item) => {
                return (
                  <img
                    key={item._id}
                    className="item "
                    src={item.photo}
                    alt={item.title}
                  /> //this should be perform the uploaded pic
                );
              })}
            </div>
          ) : (
            <div className="scrollview">
              {mypics.map((item) => {
                return (
                  <div key={item._id} className="">
                    <div className="card home-card" key={item._id}>
                      {item.postedBy !== null && (
                        <h5>
                          <Link
                            to={
                              item.postedBy._id !== null &&
                              item.postedBy._id !== state._id
                                ? `/profile/${item.postedBy._id}`
                                : "/profile"
                            }
                          >
                            {item.postedBy !== null
                              ? item.postedBy.name
                              : "sai"}{" "}
                          </Link>
                          {item.postedBy._id !== null &&
                            item.postedBy._id === state._id && (
                              <i
                                className="material-icons"
                                style={{ float: "right" }}
                                onClick={() => deletePost(item._id)} //delete icon display here
                              >
                                delete_forever{" "}
                              </i>
                            )}
                        </h5>
                      )}
                      {/* <h5>
                  {
                    console.log(state)
                    
                  }
              <Link to={item.postedBy._id&&item.postedBy._id !==state._id?"/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name} </Link>
                {item.postedBy._id&&item.postedBy._id ===state._id && <i  className ="material-icons" style={{float:"right"}}
                 onClick={()=>deletePost(item._id)}                                         //delete icon display here
                 >delete_forever </i>
                 }
                </h5>
                 */}

                      <div className="card-image">
                        <img src={item.photo} alt={item.photo} />
                      </div>
                      <div className="card-content">
                        {item.likes.includes(state._id) ? (
                          <i
                            className="material-icons"
                            style={{ color: "red" }}
                            onClick={() => {
                              unlikePost(item._id);
                            }}
                          >
                            favorite{" "}
                          </i>
                        ) : (
                          <i
                            className="material-icons"
                            onClick={() => {
                              likePost(item._id);
                            }}
                          >
                            favorite_border{" "}
                          </i>
                        )}

                        <h6>{item.likes.length} likes</h6>
                        <h5>{item.title}</h5>
                        <p>{item.body}</p>
                        {item.comments.map((record) => {
                          return (
                            record.postedBy !== null && (
                              <h6 key={record._id}>
                                <span style={{ fontWeight: "500" }}>
                                  {record.postedBy.name &&
                                  record.postedBy.name !== null
                                    ? record.postedBy.name
                                    : "0"}{" "}
                                </span>{" "}
                                {record.text}{" "}
                              </h6>
                            )
                          );
                        })}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            makeComment(e.target[0].value, item._id);
                          }}
                        >
                          <input type="text" placeholder="comment" />
                        </form>
                      </div>
                    </div>
                    <div>
                      {/* <img
                    key={item._id}
                    className="item "
                    src={item.photo}
                    alt={item.title}
                  /> */}
                      {}
                    </div>
                  </div> //this should be perform the uploaded pic
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Profile;
