import * as React from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <div className="divv">
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e91b6f554def28c3fee2f4081ba13fa77aac0e1ae3db8c97de078480e01218?apiKey=b4b300fd8eb04a5786bc9760823748ca&"
          className="img"
          alt=""
        />
        <div className="div-a">
          <div className="div-b">
            <div className="column">
              <div className="div-c">
                <div className="div-d">
                  <h1>Face Recognition Attendance System</h1>
                </div>
                <div className="div-d">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                  natoque penatibus et magnis dis parturient montes, nascetur
                  ridiculus <br />
                  mus. Donec quam felis, ultricies nec, pellentesque eu, pretium
                  quis, sem. Nulla consequat massa quis enim.
                </div>
                <div>
                  <Link to="/Auth">
                    <button className="div-e">Get Started</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="column-2">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/7c71d39df8103e8c4231a2b4d6c6c3ae01eb9e8cef953d0b40b80969ba03f32c?apiKey=b4b300fd8eb04a5786bc9760823748ca&"
                className="img-2"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomePage;
