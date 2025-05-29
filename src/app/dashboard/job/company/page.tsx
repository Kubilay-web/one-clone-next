import React, { useEffect } from "react";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);
  return <div>Company</div>;
}
