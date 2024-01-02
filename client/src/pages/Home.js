import { useEffect, useState } from "react";
import Gallery from "../components/Gallery";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function Home() {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const url = `${baseUrl}/api/posts`;

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        setData(response);
        // console.log(response);
      })
      .catch((e) => console.log(e.message));
  }, [url]);

  return (
    <div>
      {/* ------------------ BANNER -----------------------*/}

      <div className={`${!isLoaded && "opacity-0"} position-relative `}>
        <img
          src={"./banner.jpg"}
          className="d-block object-fit-cover w-100 banner"
          onLoad={() => setIsLoaded(true)}
          alt="..."
        />

        <div className=" position-absolute top-0 h-100 w-100 bg-dark bg-gradient bg-opacity-50 ">
          {/* ------------------ DESKTOP BANNER------------- */}
          <div className="justify-content-center align-items-center h-100 w-50 desktop">
            <div className=" text-white ms-5 ps-5">
              <h1 className="fw-bold">Nature</h1>
              <p className=" fs-5 mb-4 desktop">
                Nature's wonders take center stage in this category, where
                photographers capture the breathtaking landscapes, diverse flora
                and fauna, and mesmerizing natural phenomena that adorn our
                planet. From grand vistas to macro shots, these images transport
                viewers into the heart of the great outdoors.
              </p>
              <button className="btn btn-light fw-semibold px-3">
                Explore
              </button>
            </div>
          </div>

          {/* --------------------MOBILE BANNER------------ */}
          <div className="justify-content-center align-items-center h-100 mobile">
            <div className=" text-white mx-4">
              <h1>Nature</h1>
              <p className=" fs-6 mb-3">
                Explore the breathtaking landscapes, diverse flora and fauna,
                and mesmerizing natural phenomena.
              </p>
              <button className="btn btn-light">Explore</button>
            </div>
          </div>
        </div>
      </div>

      {!isLoaded && (
        <div className=" placeholder-glow ">
          <div
            className=" placeholder object-fit-cover w-100 banner"
            style={{ height: "1281px", width: "1920px" }}
          ></div>
        </div>
      )}

      <br />

      {/* ------------- GALLERY -------------- */}

      {data && <Gallery data={data} setData={setData} />}
    </div>
  );
}

export default Home;
