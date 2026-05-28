const express = require('express');
const cors = require('cors');
const indexRoutes = require('./routes/index.route');
const connectDB= require('./config/db.config');

const app = express();
const port = process.env.PORT || 3000;

await connectDB().then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});

app.use(cors({
    origin: '*' 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy");  
});

app.use("/api", indexRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});