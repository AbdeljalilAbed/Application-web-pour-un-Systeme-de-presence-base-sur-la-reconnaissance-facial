import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import UsthbImage from "../images/usthb.png"; // Import the image
import Image from "../images/img.jpg"; // Import the image

function HomePage() {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex flex-column mb-3">
          <div className="p-2">
            <div className="d-flex justify-content-start">
              <img loading="lazy" src={UsthbImage} className="img" alt="" />
            </div>
          </div>
        </div>
        <div class="container mt-5 pt-5">
          <div class="row">
            <div class="col-md pt-5">
              <div class="row m-2">
                <div class="col-sm">
                  <h1>Face Recognition Attendance System</h1>
                </div>
              </div>
              <div class="row m-2">
                <div class="col-sm">
                  <p>
                    Welcome to the Smart Faculty Face Recognition Attendance
                    System! Our cutting-edge solution revolutionizes attendance
                    management in our Computer Science faculty. Using advanced
                    facial recognition technology, marking attendance is now
                    effortless and accurate.
                  </p>
                </div>
              </div>
              <div class="row m-2">
                <div class="col-sm">
                  <Link to="/Auth">
                    <button type="button" class="btn  btn-dark btn-lg">
                      Get started
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="text-center">
                <img src={Image} class="img-fluid" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomePage;
