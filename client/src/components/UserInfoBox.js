import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "./Avatar";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function UserInfoBox() {
  const { username } = useParams();
  const userUrl = `${baseUrl}/api/user/info/${username}`;

  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    fetch(userUrl)
      .then((res) => res.json())
      .then((response) => {
        setUserInfo(response.data);
        // console.log(response[0], 17);
      })
      .catch((e) => console.log(e));
  }, [userUrl]);

  return (
    <>
      <div className="container my-3 my-md-4">
        <div
          className=" d-flex flex-column flex-md-row m-auto"
          style={{ width: "fit-content" }}
        >
          <div className="me-1 me-md-3 me-lg-4 ">
            {userInfo && (
              <Avatar
                w="9.3rem"
                avatar={userInfo?.avatar}
              />
            )}
          </div>

          <div className="ms-0 ms-md-3 ms-lg-4 ">
            <h1 className="mb-0">{`${userInfo.fName} ${userInfo.lName}`}</h1>
            <h5 className="text-secondary mt-0">{`@${userInfo.username}`}</h5>
            <h6 className="my-2 fw-normal">{`Download free, beautiful high-quality photos curated by ${userInfo?.fName} ${userInfo?.lName}.`}</h6>
            <div className=" d-flex align-items-center text-secondary">
              <svg className="me-2" width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#767676"
                  d="M5.988 15.637C7.313 17.596 9.317 19.717 12 22c2.683-2.283 4.688-4.404 6.013-6.363C19.338 13.679 20 11.867 20 10.2c0-2.5-.804-4.492-2.413-5.975C15.979 2.742 14.117 2 12 2c-2.117 0-3.979.742-5.587 2.225C4.804 5.708 4 7.7 4 10.2c0 1.667.663 3.479 1.988 5.437ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                ></path>
              </svg>
              <span className="fs-6">India</span>
            </div>
          </div>
        </div>
      </div>
      <br />
    </>
  );
}

export default UserInfoBox;
