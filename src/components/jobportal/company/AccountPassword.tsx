import React, { useEffect } from "react";

export default function AccountPassword() {
  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);
  return <div>AccountPassword</div>;
}
