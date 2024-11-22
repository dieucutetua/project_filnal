import React from "react";

const Histories = () => {
  return (
    <div className="main">
      {/* Header */}
      <header className="header">
        <h1>User!</h1>
        <button className="logout">Upload</button>
      </header>

      {/* Content */}
      <div className="content">
        <div className="card">Day : dd/mm/yy</div>
        <div className="card">Day : dd/mm/yy</div>
        <div className="card">Day : dd/mm/yy</div>
      </div>
    </div>
  );
};

export default Histories;
