const express = require('express');
require('dotenv').config();
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const postgres = require('postgres');
const path = require('path');
const { info } = require('console');
const app = express();
const otpGenerator = require('otp-generator')
const PORT = process.env.PORT || 5000;
const {Resend} = require('resend')
const Storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const currentTime = new Date().getTime(); 
    const filename = `${currentTime}_${file.originalname}`; 
    cb(null, filename); 
  }
});

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
}

const upload = multer({storage: Storage});

app.use(express.json());
app.use(cors());

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  try {
    const result = await sql`CREATE TABLE IF NOT EXISTS Sheikh(name VARCHAR, age INT)`;
    console.log(result);
  } catch (error) {
    console.error('Error creating table:', error);
  }
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', async (req, res) => {
  try {
    const courses = await sql`SELECT * from Course`;
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

let stid = 1;

app.post('/student/register', upload.single('profile'), async(req, res) => {
  try {
    const formData = req.body;
    const profile = req.file; 
    console.log(formData);
    console.log(profile); 
    const {name, email, contact, password} = formData;
    const filename = profile.filename;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingEmail = await sql`SELECT email FROM Students WHERE email = ${email}`;
    if (existingEmail.length > 0 && existingEmail[0].email === email) {
      return res.status(401).json({ message: 'User already exists, please go to login' });
    }
    const maxAdminId = await sql`SELECT MAX(student_id) FROM Students`;
    const nextAdminId = (maxAdminId[0].max || 0) + 1;
    await sql`INSERT INTO Students(student_id, Name, email, contact, student_password, imgName)
    VALUES(${nextAdminId}, ${name}, ${email}, ${contact}, ${hashedPassword}, ${filename})`;
    console.log('Data uploaded successfully');
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

let id = 1;

app.post('/admin/register', async (req, res) => {
  try {
    const { name, email, contact, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingEmail = await sql`SELECT admin_email FROM provider WHERE admin_email = ${email}`;
    if (existingEmail.length > 0 && existingEmail[0].admin_email === email) {
      return res.status(401).json({ message: 'User already exists' });
    }
    const maxAdminId = await sql`SELECT MAX(admin_id) FROM provider`;
    const nextAdminId = (maxAdminId[0].max || 0) + 1; 
    await sql`INSERT INTO provider(admin_id, admin_name, admin_number, admin_email, admin_password)
    VALUES (${nextAdminId}, ${name}, ${contact}, ${email}, ${hashedPassword})`;
    console.log("Data added to database successfully");
    res.status(200).json({ message: 'Admin registration successful' });
  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sql`SELECT admin_password FROM provider WHERE admin_email = ${email}`;
    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, result[0].admin_password);
    if (match) {
      const token = generateAccessToken({ email: email });
      res.json({ token: token });
    } else {
      res.status(401).json({ message: 'Invalid Password' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sql`SELECT student_password,student_id FROM Students WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' },);
    }
    const match = await bcrypt.compare(password, result[0].student_password);
    if (match) {
      const token = generateAccessToken({ email: email });
      res.json({ token: token, data: result});
    } else {
      res.status(401).json({ message: 'Invalid Password' });
    }
  } catch (error) {
    console.error('Error during student login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

let course_id = 1;
app.post('/addCourses',authenticateToken,upload.single('thumbnail'), async (req, res) => {
    try {
      const formData = req.body;
      const thumbnail = req.file;
      console.log(formData);
      console.log(thumbnail);
      const { course_name, category, description } = formData;
      const thumbnailImg = thumbnail.filename;
      await sql `INSERT INTO Course(course_id, course_name, category, thumbnail, description)
      VALUES(${course_id}, ${course_name}, ${category}, ${thumbnailImg}, ${description})`;
      course_id++;
      console.log("Course added successfully");
      res.status(200).json({ message: 'Course added successfully' });
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({ message: 'Server error' });
    }
});


app.post('/student/profile',authenticateToken, async(req,res)=>{
  const data = req.body;
  console.log(data);
  const id = data.loggedId;
  const Info = await sql`SELECT * FROM STUDENTS WHERE ${id}=student_id`
  const Course = await sql`SELECT * FROM Course WHERE student_id = ${id}`
  console.log(Info);
  res.status(200).json({data:Info, course: Course});
})

app.post('/enroll',async(req,res)=>{
  const data = req.body;
  console.log(data)
  const check = await sql `SELECT student_id from Course WHERE course_id = ${data.course_id}`
  console.log(check)
  if(check[0].student_id===data.LoggedId){
    res.status(200).json({message:'Already LoggedIn'})
  }else{
  const result = await sql`UPDATE Course SET student_id = ${data.LoggedId} WHERE course_id = ${data.course_id}`
  res.status(200).json({message:'Enrolled'})
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const resend = new Resend(process.env.API);
app.get('/sendotp',async(req,res)=>{
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: ["mdtauheed9682@gmail.com"],
    subject: "hello world",
    html: `<strong>${otp}</strong>`,
  });
  if(data){
    res.status(200).json({message:"OTP sent successfully", otp:otp})
  }
  if (error) {
    return res.status(400).json({ error,message:"Error" });
  }
})


app.post('/edit/student_profile',async(req,res)=>{
  try {
    const { studentId,name, email, contact} = req.body;
    const result = await sql`
      UPDATE Students
      SET name = ${name}, email = ${email}, contact = ${contact}
      WHERE student_id = ${studentId}`;
     if (result) {
        res.status(200).json({ message: 'Profile updated successfully' });
      } else {
        res.status(400).json({ message: 'Failed to update profile' });
      }
      } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
     }   
})

app.post('/', async (req, res) => {
  try {
    const { category } = req.body;
    const courses = await sql`SELECT * FROM Course WHERE category = ${category}`;
    res.json(courses);
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
