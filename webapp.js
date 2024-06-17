const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

const app = express();

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root123',
  database: 'project_rfid'
});

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  cors: {
    origin: "*",
  }
}));

// --------------------ADMIN and Dashboard API------------------------------
// Route to handle admin login
app.post('/admin', (req, res) => {
  const { admin_username, admin_password } = req.body;

  // Check if admin credentials are provided
  if (!admin_username || !admin_password) {
    return res.status(400).json({ error: 'Admin username and password are required' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to authenticate admin
    connection.query('SELECT * FROM admin_login WHERE admin_username = ? AND admin_password = ?', [admin_username, admin_password], (error, results) => {
      // Release the connection
      connection.release();
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Error fetching data' });
      }

      // Check if admin exists and credentials match
      if (results.length === 0) {
        // No admin found or incorrect credentials
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Admin authenticated successfully
      res.status(200).json({ message: 'Admin authenticated successfully' });
    });
  });
});

// API endpoint to fetch student information
app.get('/studentinfo', (req, res) => {

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM studentinfo', (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching student information:', error);
        return res.status(500).json({ error: 'Error fetching student information' });
      }
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to fetch Student Device information
app.get('/studentDevice', (req, res) => {

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM student_device', (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching student information:', error);
        return res.status(500).json({ error: 'Error fetching student information' });
      }
      // Send the fetched data
      res.json(rows);
    });
  });
});

// -------------------------Faculty Login API--------------------------------
// Route to handle Faculty login
// app.post('/faculty', (req, res) => {
//   const { faculty_user, faculty_pass } = req.body;

//   // Check if Faculty credentials are provided
//   if (!faculty_user || !faculty_pass) {
//     return res.status(400).json({ error: 'Faculty username and password are required' });
//   }

//   // Get a connection from the pool
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error connecting to database:', err);
//       return res.status(500).json({ error: 'Database connection error' });
//     }

//     // Perform the database query to authenticate faculty
//     connection.query('SELECT * FROM teacher_login WHERE teacher_user = ? AND teacher_pass = ?', [faculty_user, faculty_pass], (error, teacherResults) => {
//       if (error) {
//         console.error('Error fetching data:', error);
//         connection.release();
//         return res.status(500).json({ error: 'Error fetching data' });
//       }

//       // If no result from teacher_login, check librarian_login
//       if (teacherResults.length === 0) {
//         connection.query('SELECT * FROM librarian_login WHERE librarian_user = ? AND librarian_pass = ?', [faculty_user, faculty_pass], (error, librarianResults) => {
//           // If no result from librarian_login, check gym_login
//           if (librarianResults.length === 0) {
//             connection.query('SELECT * FROM gym_login WHERE gym_user = ? AND gym_pass = ?', [faculty_user, faculty_pass], (error, gymResults) => {
//               // If no result from gym_login, check guard_login
//               if (gymResults.length === 0) {
//                 connection.query('SELECT * FROM guard_login WHERE guard_user = ? AND guard_pass = ?', [faculty_user, faculty_pass], (error, guardResults) => {
//                   // If no result from guard_login, check registrar_login
//                   if (guardResults.length === 0) {
//                     connection.query('SELECT * FROM registrar_login WHERE registrar_user = ? AND registrar_pass = ?', [faculty_user, faculty_pass], (error, registrarResults) => {
//                       // Release the connection
//                       connection.release();
//                       if (error) {
//                         console.error('Error fetching data:', error);
//                         return res.status(500).json({ error: 'Error fetching data' });
//                       }

//                       // Check if registrar user exists and credentials match
//                       if (registrarResults.length === 0) {
//                         // No faculty found or incorrect credentials
//                         return res.status(401).json({ error: 'Invalid username or password' });
//                       }

//                       // Registrar user authenticated successfully
//                       res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'registrar' });
//                     });
//                   } else {
//                     // Guard user authenticated successfully
//                     res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'guard' });
//                   }
//                 });
//               } else {
//                 // Gym user authenticated successfully
//                 res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'gym' });
//               }
//             });
//           } else {
//             // Librarian authenticated successfully
//             res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'librarian' });
//           }
//         });
//       } else {
//         // Teacher authenticated successfully
//         res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'teacher' });
//       }
//     });
//   });
// });

app.post('/faculty', (req, res) => {
  const { faculty_user, faculty_pass } = req.body;

  // Check if Faculty credentials are provided
  if (!faculty_user || !faculty_pass) {
    return res.status(400).json({ error: 'Faculty username and password are required' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to authenticate faculty
    connection.query('SELECT * FROM teacher_login WHERE teacher_user = ? AND teacher_pass = ?', [faculty_user, faculty_pass], (error, teacherResults) => {
      if (error) {
        console.error('Error fetching data:', error);
        connection.release();
        return res.status(500).json({ error: 'Error fetching data' });
      }

      if (teacherResults.length > 0) {
        const teacher = teacherResults[0];
        res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'teacher', userId: teacher.teacher_id });
        connection.release();
      } else {
        connection.query('SELECT * FROM librarian_login WHERE librarian_user = ? AND librarian_pass = ?', [faculty_user, faculty_pass], (error, librarianResults) => {
          if (librarianResults.length > 0) {
            const librarian = librarianResults[0];
            res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'librarian', userId: librarian.librarian_id });
          } else {
            connection.query('SELECT * FROM gym_login WHERE gym_user = ? AND gym_pass = ?', [faculty_user, faculty_pass], (error, gymResults) => {
              if (gymResults.length > 0) {
                const gym = gymResults[0];
                res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'gym', userId: gym.gym_id });
              } else {
                connection.query('SELECT * FROM guard_login WHERE guard_user = ? AND guard_pass = ?', [faculty_user, faculty_pass], (error, guardResults) => {
                  if (guardResults.length > 0) {
                    const guard = guardResults[0];
                    res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'guard', userId: guard.guard_id });
                  } else {
                    connection.query('SELECT * FROM registrar_login WHERE registrar_user = ? AND registrar_pass = ?', [faculty_user, faculty_pass], (error, registrarResults) => {
                      connection.release();
                      if (registrarResults.length > 0) {
                        const registrar = registrarResults[0];
                        res.status(200).json({ message: 'Faculty authenticated successfully', userType: 'registrar', userId: registrar.registrar_id });
                      } else {
                        return res.status(401).json({ error: 'Invalid username or password' });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
});


// ---------------------RFID Registration API--------------------------- 
// API endpoint to fetch student information based on TUPT-ID
app.get('/rfidRegistration/studentInfo', (req, res) => {
  const { tuptId } = req.query;

  // Check if TUPT-ID is provided
  if (!tuptId) {
    return res.status(400).json({ error: 'TUPT-ID is required' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM studentinfo WHERE studentInfo_tuptId = ?', [tuptId], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching student information:', error);
        return res.status(500).json({ error: 'Error fetching student information' });
      }

      // Check if student with the provided TUPT-ID exists
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Student not found with the provided TUPT-ID' });
      }

      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to insert RFID tag value into the database for a specific student
app.post('/rfidRegistration/:tuptId', (req, res) => {
  const { tuptId } = req.params;
  const { tagValue } = req.body;

  // Check if both TUPT ID and tagValue are provided
  if (!tuptId || !tagValue) {
    return res.status(400).json({ error: 'TUPT ID and RFID tagValue are required' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to insert RFID tagValue into the student account
    connection.query('UPDATE studentinfo SET tagValue = ? WHERE studentInfo_tuptId = ?', [tagValue, tuptId], (error, result) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error inserting RFID tagValue:', error);
        return res.status(500).json({ error: 'Error inserting RFID tagValue' });
      }

      console.log('RFID tagValue inserted successfully for TUPT ID:', tuptId);
      res.json({ success: true });
    });
  });
});

// --------------------Device Registration---------------------------------
// API endpoint to fetch student information based on TUPT-ID
app.get('/deviceRegistration', (req, res) => {
  const { serialNumber } = req.query;

  // Check if TUPT-ID is provided
  if (!serialNumber) {
    return res.status(400).json({ error: 'Serial Number is required' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM student_device WHERE device_serialNumber = ?', [serialNumber], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching Device information:', error);
        return res.status(500).json({ error: 'Error fetching Device information' });
      }

      // Check if student with the provided TUPT-ID exists
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Device not found with the provided Serial Number' });
      }

      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to insert Device code value into the database for a specific Device
app.post('/deviceRegistration/:serialNumber', (req, res) => {
  const { serialNumber } = req.params;
  const { deviceCode } = req.body; // Ensure the client sends the correct property

  // Check if both serialNumber and deviceCode are provided
  if (!serialNumber || !deviceCode) {
    return res.status(400).json({ error: 'Serial number and Device code are required' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to insert deviceCode into the student account
    connection.query('UPDATE student_device SET deviceRegistration = ? WHERE device_serialNumber = ?', [deviceCode, serialNumber], (error, result) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error inserting Device code:', error);
        return res.status(500).json({ error: 'Error inserting device code' });
      }

      console.log('Device code inserted successfully for Serial number:', serialNumber);
      res.json({ success: true });
    });
  });
});

// --------------------END Device Registration---------------------------------

// ----------------------Adding Attendance---------------------------------
app.post('/add-Attendance', (req, res) => {
  const { attendance_description, attendance_code, attendance_date } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ error: "Database connection error" })
    }
    const sql = `INSERT INTO attendance (attendance_description, attendance_code, attendance_date) VALUES (?, ?, ?)`;
    const values = [attendance_description, attendance_code, attendance_date];

    connection.query(sql, values, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error adding attendance:', err);
        res.status(500).json({ error: 'An error occurred while adding attendance' });
        return;
      }

      console.log('Attendance added successfully');
      res.status(201).json({ message: 'Attendance added successfully' });
    });
  });
});

// ----------------------Fetching Attendance List----------------------------
app.get('/attendance', (req, res) => {
  // Perform a database query to fetch the attendance data
  pool.query('SELECT * FROM attendance', (error, results) => {
    if (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ error: 'An error occurred while fetching attendance data' });
      return;
    }

    // If data is fetched successfully, send it back to the client
    res.json(results);
  });
});

// -------------------Faculty Teacher Attendance-------------------------
// ----------------------Adding Attendance---------------------------------
app.post('/Facultyadd-Attendance', (req, res) => {
  const { attendance_description, attendance_code, attendance_date, userId } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ error: "Database connection error" });
    }
    const sql = `INSERT INTO attendance (attendance_description, attendance_code, attendance_date, userId) VALUES (?, ?, ?, ?)`;
    const values = [attendance_description, attendance_code, attendance_date, userId];

    connection.query(sql, values, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error adding attendance:', err);
        res.status(500).json({ error: 'An error occurred while adding attendance' });
        return;
      }

      console.log('Attendance added successfully');
      res.status(201).json({ message: 'Attendance added successfully' });
    });
  });
});

// ----------------------Fetching Attendance List----------------------------
app.get('/Facultyattendance/:userId', (req, res) => {
  const { userId } = req.params;
  // Perform a database query to fetch the attendance data for a specific user
  pool.query('SELECT * FROM attendance WHERE userId = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ error: 'An error occurred while fetching attendance data' });
      return;
    }

    // If data is fetched successfully, send it back to the client
    res.json(results);
  });
});

// -------------------END Faculty Teacher Attendance-------------------------

// ----------------------Fetching Attendance Report-------------------------
app.get('/attendance/report/:code', (req, res) => {
  const { code } = req.params;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for the provided attendance code
    const query = 'SELECT * FROM attendance_taphistory WHERE attendance_code = ?';
    connection.query(query, [code], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }

      // Send the fetched data
      res.json(rows);
    });
  });
});

// ----------------------Attendance fetch API--------------------------------
// API endpoint to fetch data for BTVTEICT-CP-1D
app.get('/BTVTEICT-CP-1D', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D
    connection.query("SELECT * FROM attendance_taphistory WHERE attendance_section = '1D'", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to fetch data for BTVTEICT-CP-2D
app.get('/BTVTEICT-CP-2D', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D
    connection.query("SELECT * FROM attendance_taphistory WHERE attendance_section = '2D'", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to fetch data for BTVTEICT-CP-3D
app.get('/BTVTEICT-CP-3D', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D
    connection.query("SELECT * FROM attendance_taphistory WHERE attendance_section = '3D'", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to fetch data for BTVTEICT-CP-4D
app.get('/BTVTEICT-CP-4D', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D
    connection.query("SELECT * FROM attendance_taphistory WHERE attendance_section = '4D'", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// ----------------------Report API------------------------------------
// API endpoint to fetch data for Library Report
app.get('/Library-Report', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for Library
    connection.query("SELECT * FROM library_taphistory", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to fetch data for Gym Report
app.get('/Gym-Report', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for Gym
    connection.query("SELECT * FROM gym_taphistory", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to fetch data for Registrar Report
app.get('/Registrar-Report', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for Registrar
    connection.query("SELECT * FROM registrar_taphistory", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint to fetch data for Gatepass Report
app.get('/Gatepass-Report', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for Gatepass
    connection.query("SELECT * FROM gatepass_taphistory", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});

// ---------------------ND of REPORT API------------------------------

// --------------------Fetch Device List-----------------------------
app.post('/DeviceList', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for devices with deviceRegistration as null
    connection.query("SELECT * FROM student_device WHERE deviceRegistration = ''", (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching device information:', error);
        return res.status(500).json({ error: 'Error fetching device information' });
      }
      
      // Send the fetched data
      res.json(rows);
    });
  });
});


// ------------------------PDF Download server------------------------
// BTVTEICT-CP-1D
app.get('/BTVTEICT-CP-1D/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D based on date
    connection.query(
      "SELECT * FROM attendance_taphistory WHERE attendance_section = '1D' AND DATE_FORMAT(STR_TO_DATE(attendance_historyDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?",
      [formattedDate],
      (error, rows) => {
        // Release the connection
        connection.release();

        if (error) {
          console.error('Error fetching tap history student information:', error);
          return res.status(500).json({ error: 'Error fetching tap history student information' });
        }

        // Send the fetched data
        res.json(rows);
      }
    );
  });
});

// BTVTEICT-CP-2D
app.get('/BTVTEICT-CP-2D/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D based on date
    connection.query(
      "SELECT * FROM attendance_taphistory WHERE attendance_section = '2D' AND DATE_FORMAT(STR_TO_DATE(attendance_historyDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?",
      [formattedDate],
      (error, rows) => {
        // Release the connection
        connection.release();

        if (error) {
          console.error('Error fetching tap history student information:', error);
          return res.status(500).json({ error: 'Error fetching tap history student information' });
        }

        // Send the fetched data
        res.json(rows);
      }
    );
  });
});

// BTVTEICT-CP-3D
app.get('/BTVTEICT-CP-3D/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  // Convert the date format to match the format in the database
  // No need to format again since the frontend already sends the date in the expected format
  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D based on date
    connection.query(
      "SELECT * FROM attendance_taphistory WHERE attendance_section = '3D' AND DATE_FORMAT(STR_TO_DATE(attendance_historyDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?",
      [formattedDate],
      (error, rows) => {
        // Release the connection
        connection.release();

        if (error) {
          console.error('Error fetching tap history student information:', error);
          return res.status(500).json({ error: 'Error fetching tap history student information' });
        }

        // Send the fetched data
        res.json(rows);
      }
    );
  });
});

// BTVTEICT-CP-4D
app.get('/BTVTEICT-CP-4D/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data for BTVTEICT-CP-3D based on date
    connection.query(
      "SELECT * FROM attendance_taphistory WHERE attendance_section = '4D' AND DATE_FORMAT(STR_TO_DATE(attendance_historyDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?",
      [formattedDate],
      (error, rows) => {
        // Release the connection
        connection.release();

        if (error) {
          console.error('Error fetching tap history student information:', error);
          return res.status(500).json({ error: 'Error fetching tap history student information' });
        }

        // Send the fetched data
        res.json(rows);
      }
    );
  });
});

// Library Report PDF API
app.get('/Library-Report/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data based on date
    const query = `
      SELECT * 
      FROM library_taphistory 
      WHERE DATE_FORMAT(STR_TO_DATE(library_InHistoryDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?
    `;
    connection.query(query, [formattedDate], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }

      // Send the fetched data
      res.json(rows);
    });
  });
});

// Gym Report PDF API
app.get('/Gym-Report/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data based on date
    const query = `
      SELECT * 
      FROM gym_taphistory 
      WHERE DATE_FORMAT(STR_TO_DATE(gym_InHistoryDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?
    `;
    connection.query(query, [formattedDate], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }

      // Send the fetched data
      res.json(rows);
    });
  });
});

// Registrar Report PDF API
app.get('/Registrar-Report/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data based on date
    const query = `
      SELECT * 
      FROM registrar_taphistory 
      WHERE DATE_FORMAT(STR_TO_DATE(registrar_taphistoryDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?
    `;
    connection.query(query, [formattedDate], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }

      // Send the fetched data
      res.json(rows);
    });
  });
});

// Gatepass Report PDF API
app.get('/Gatepass-Report/pdf', (req, res) => {
  const { date } = req.query; // Get the date from query parameters
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const formattedDate = date;

  // Check if the formatted date is valid
  if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch data based on date
    const query = `
      SELECT * 
      FROM gatepass_taphistory 
      WHERE DATE_FORMAT(STR_TO_DATE(gatepass_historyDate, '%c/%e/%Y, %r'), '%Y-%m-%d') = ?
    `;
    connection.query(query, [formattedDate], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap history student information:', error);
        return res.status(500).json({ error: 'Error fetching tap history student information' });
      }

      // Send the fetched data
      res.json(rows);
    });
  });
});
// ------------------------END PDF Download server---------------------

// ------------------------Library tap API----------------------------
// API endpoint to fetch the latest tap status
app.get('/tap_status', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch the latest entry
    connection.query('SELECT * FROM library_taphistory ORDER BY library_tapHistoryID DESC LIMIT 1', (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap status:', error);
        return res.status(500).json({ error: 'Error fetching tap status' });
      }
      // Send the fetched data
      res.json(rows[0]); // Send only the first row (latest entry)
    });
  });
});

// API endpoint to fetch the latest Gym tap status
app.get('/gym_status', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to fetch the latest entry
    connection.query('SELECT * FROM gym_taphistory ORDER BY gym_taphistoryID DESC LIMIT 1', (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching tap status:', error);
        return res.status(500).json({ error: 'Error fetching tap status' });
      }
      // Send the fetched data
      res.json(rows[0]); // Send only the first row (latest entry)
    });
  });
});

// ------------------------END of Tap status server----------------------------

// Start the server
const PORT = process.env.PORT || 2526;
app.listen(PORT, () => {
  console.log(`Admin server is running on port ${PORT}`);
});