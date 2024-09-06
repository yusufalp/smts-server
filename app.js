import express, { json, urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(morgan("dev"));

app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("We are just getting started...");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
