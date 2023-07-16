import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Gallery from '../components/Gallery';
import { clientKey } from '../ApiKey/keys';

function UserProfile() {
  const { userName } = useParams();
  const [userInfo, setUserInfo] = useState([]);
  // const userUrl = `https://api.unsplash.com/users/${userName}/${val}?client_id=${clientKey}`;

  useEffect(() => {
    fetch('/api/user/' + userName)
      .then(res => res.json())
      .then(response => {
        setUserInfo(response);
        // console.log(response);
      })
      .catch(e => console.log(e));
  }, []);

  // console.log(user);
  // console.log(user.photos);
  // const data = user.photos;
  return (
    <>
      {console.log(userInfo)}
      {userInfo && <Gallery data={userInfo} />}
    </>
  )
}

export default UserProfile