import React from "react";
import { Link } from "react-router-dom";
import routes from "routes.js"; 

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      <ul>
        {routes.map((route, index) => (
          <li key={index}>
            <Link to={`${route.layout}/${route.path}`}>
              {route.icon}
              <span>{route.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
