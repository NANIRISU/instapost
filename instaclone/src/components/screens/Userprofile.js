import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  //console.log(userid)
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)

        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((previousstate) => {
          return {
            ...previousstate,
            user: {
              ...previousstate.user,
              followers: [...previousstate.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((previousstate) => {
          const newFollower = previousstate.user.followers.filter(
            (item) => item !== data._id
          );

          return {
            ...previousstate,
            user: { ...previousstate.user, followers: newFollower },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "2px solid black",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
                alt="error"
              />
            </div>

            <div>
              <h4>{userProfile.user.name} </h4>
              <h6>{userProfile.user.email} </h6>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "110%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers </h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>

              {showfollow ? (
                <button className="follow btn" onClick={() => followUser()}>
                  follow
                </button>
              ) : (
                <button className="unfollow btn" onClick={() => unfollowUser()}>
                  unfollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
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
        </div>
      ) : (
        <h2> loading..?</h2>
      )}
    </>
  );
};

export default Profile;
