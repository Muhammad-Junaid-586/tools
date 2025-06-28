"use client";

import Upload from "../components/Upload";
import { useState } from "react";

export default function UploadPage() {
  const [students, setStudents] = useState([]);

  return (
    <div>
      <Upload onDataFetched={(data) => setStudents(data)} />
    </div>
  );
}
