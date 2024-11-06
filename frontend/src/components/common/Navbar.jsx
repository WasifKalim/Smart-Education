import React from "react";
import navlogo from "../../assets/Logo/Logo-Full-Light.png";

function Navbar() {
  return (
    <div className="flex justify-around pt-5 border-b-2 border-b-white ">
      <div className="LOGO ">
        <img src={navlogo} width={160} height={42} loading="lazy" />
      </div>
      <div className="MIDDLE text-white flex gap-5">
        <div>Home</div>
        <div>
          <div className="relative group">
            {" "}
            <button className="text-white focus:outline-none">Menu</button>
            <div className="absolute hidden group-hover:block  text-gray-800 mt-2 rounded-md shadow-lg">
              {" "}
              <a href="#" className="block px-4 py-2 hover:bg-gray-200 tesxt- ">
                Home
              </a>{" "}
              <a href="#" className="block px-4 py-2 hover:bg-gray-200 text-white">
                About
              </a>{" "}
              <a href="#" className="block px-4 py-2 hover:bg-gray-200 text-white">
                Services
              </a>{" "}
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                Contact
              </a>{" "}
            </div>{" "}
          </div>
        </div>
        <div>About Us</div>
        <div>Contact Us</div>
      </div>
      <div className="RIGHT text-white">
        <button>Login</button>
        <button> Sign Up</button>
      </div>
    </div>
  );
}

export default Navbar;
