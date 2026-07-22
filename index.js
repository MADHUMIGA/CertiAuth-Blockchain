// index.js

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/company", require("./routes/company"));
app.use("/university", require("./routes/university"));

const adminCertificates = require("./routes/adminCertificates");
app.use("/admin", adminCertificates);

app.listen(5000, () => console.log("Server running on port 5000"));
