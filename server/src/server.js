const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());

//route 
const subjectRoute = require('./routes/subjectR')
const chapterRoute = require('./routes/chapterR')
const lessonRoute = require('./routes/lessonR')
const questionRoute = require('./routes/questionR')
const examRoute = require('./routes/examR')
const resultRoute = require('./routes/resultR')
const userRoute = require('./routes/userR')
const assessmentRoute = require('./routes/assessmentR')
const chatAiRoute = require('./routes/chataiR')
const statisticRoute = require('./routes/statisticR')
const homeRoute = require('./routes/homeR')

app.use("/api/subject", subjectRoute);
app.use("/api/chapter", chapterRoute);
app.use("/api/lesson", lessonRoute);
app.use("/api/question", questionRoute);
app.use("/api/exam", examRoute);
app.use("/api/result", resultRoute);
app.use("/api/user", userRoute);
app.use("/api/assessment", assessmentRoute);
app.use("/api/chatbot", chatAiRoute);
app.use("/api/statistic", statisticRoute);
app.use("/api/home", homeRoute);

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();