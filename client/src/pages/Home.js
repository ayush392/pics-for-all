import { useEffect, useState } from "react";
import Gallery from "../components/Gallery";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function Home() {
  const [data, setData] = useState([]);
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

      <div className=" position-relative ">
        <img
          src={"./banner.jpg"}
          className="d-block object-fit-cover w-100 banner"
          alt="..."
        />

        <div className=" position-absolute top-0 h-100 bg-dark bg-gradient bg-opacity-50 ">
          <div className="d-flex justify-content-center align-items-center h-100 w-50">
            <div className=" text-white" style={{ marginLeft: "14%" }}>
              <h1 className="fw-bold">Nature</h1>
              <p className=" fs-5 mb-4">
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
        </div>
      </div>
      <br />

      {/* ------------- GALLERY -------------- */}

      {data && <Gallery data={data} setData={setData} />}
    </div>
  );
}

export default Home;
