import React, { useState, useEffect } from "react";
import { getOfficerBoard } from "../services/user.service";
const BoardOfficer: React.FC = () => {
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    getOfficerBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setContent(_content);
      }
    );
  }, []);
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};
export default BoardOfficer;