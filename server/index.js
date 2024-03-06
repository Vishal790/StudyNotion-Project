const express = require('express');
const app = express();

const userRoutes = require("./routes/User")
 const profileRoutes = require("./routes/Profile")
const paymentsRoutes = require("./routes/Payments")
 const coursesRoutes = require("./routes/Course")
 const contactUsRoute = require("./routes/Contact");



const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary")
const fileUpload  = require("express-fileupload")
require("dotenv").config();


const PORT = process.env.PORT || 4000


database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000", "https://study-notion-project-tau.vercel.app"],
    credentials: true,
}));


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir:"/tmp"
    })
)

//cloudinary connection
cloudinaryConnect();

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",coursesRoutes);
app.use("/api/v1/payment",paymentsRoutes)
app.use("/api/v1/reach", contactUsRoute);




app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})



