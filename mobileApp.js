const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

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

// -----------------------Sign up------------------------
app.post('/signup', (req, res) => {
  // Extract user data from the request body
  const { username, password } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Insert the user data into the database
    const sql = "INSERT INTO user_login (user_name, user_password) VALUES (?, ?)";
    connection.query(sql, [username, password], (error, result) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error signing up:', error);
        return res.status(500).json({ error: 'Error signing up' });
      }

      // Send a success response
      res.status(200).json({ message: 'User signed up successfully' });
    });
  });
});

// --------------------------Login-----------------------------
app.post('/users', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM user_login', (error, rows) => {
      // Release the connection
      connection.release();
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Error fetching data' });
      }
      // Send the fetched data
      res.json(rows);
    });
  });
});

// --------------------------Student Info registration---------------------
app.post('/student_registration', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, user_id, user_email, studentProfile } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('INSERT INTO studentinfo (studentInfo_first_name, studentInfo_middle_name, studentInfo_last_name, studentInfo_tuptId, studentInfo_course, studentInfo_section, user_id, user_email, student_profile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, tuptId, course, section, user_id, user_email, studentProfile], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send a success response
      res.json({ success: true, message: 'Student registered successfully' });
    });
  });
});

// --------------------Checking TUPT ID IF IT IS EXIST-------------------
app.post('/check_tupt_id/:tuptId', (req, res) => {
  const { tuptId } = req.params;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to check if the TUPT-ID exists
    connection.query('SELECT * FROM studentinfo WHERE studentInfo_tuptId = ?', [tuptId], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send response based on whether the TUPT-ID exists
      if (results.length > 0) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    });
  });
});

// ---------------------Student info display---------------------------
app.get('/studentinfo/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM studentinfo WHERE user_id = ?', [userId], (error, rows) => {
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

// -----------------------UPDATE Student Info-----------------------------
app.post('/update_studentinfo/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { firstName, middleName, lastName, user_email, tuptId, course, section, profile } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query('UPDATE studentinfo SET studentInfo_first_name = ?, studentInfo_middle_name = ?, studentInfo_last_name = ?, user_email = ?, studentInfo_tuptId = ?, studentInfo_course = ?, studentInfo_section = ?, student_profile = ? WHERE user_id = ?', [firstName, middleName, lastName, user_email, tuptId, course, section, profile, userId], (error, result) => {
      connection.release();

      if (error) {
        console.error('Error updating student information:', error);
        return res.status(500).json({ error: 'Error updating student information' });
      }

      res.json({ success: true, message: 'Student information updated successfully' });
    });
  });
});

// -----------------------ADD Student Device-----------------------------
app.post('/add_device', (req, res) => {
  const { device_name, device_serialNumber, device_color, device_brand, user_id, device_image_url } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to insert device data
    connection.query('INSERT INTO student_device (device_name, device_serialNumber, device_color, device_brand, user_id, device_image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [device_name, device_serialNumber, device_color, device_brand, user_id, device_image_url],
      (error, results) => {
        // Release the connection
        connection.release();

        if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: 'Database query error' });
        }

        // Send a success response
        res.json({ success: true, message: 'Device added successfully' });
      }
    );
  });
});

// -----------------------UPDATE Student Device-----------------------------
app.post('/update_device/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { device_name, device_serialNumber, device_color, device_brand, device_image_url } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(
      'UPDATE student_device SET device_name = ?, device_serialNumber = ?, device_color = ?, device_brand = ?, device_image_url = ? WHERE user_id = ?',
      [device_name, device_serialNumber, device_color, device_brand, device_image_url, userId],
      (error, result) => {
        connection.release();

        if (error) {
          console.error('Error updating device information:', error);
          return res.status(500).json({ error: 'Error updating device information' });
        }

        res.json({ success: true, message: 'Device information updated successfully' });
      }
    );
  });
});

// -----------------------Fetch Student Device-----------------------------
app.get('/get_device/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to get device data for the user
    connection.query('SELECT * FROM student_device WHERE user_id = ? LIMIT 1', [user_id], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send the device data as response
      res.json(results);
    });
  });
});

// -----------------------END Fetch Student Device---------------------------

// API endpoint to fetch student information
app.get('/rfid_history/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM tap_history WHERE user_id = ?', [userId], (error, rows) => {
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

// --------------------------Checking Attendance code------------------------
app.post('/attendanceCode', (req, res) => {
  const { code } = req.body; // Assuming the code is sent in the request body

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query to check if the code exists
    connection.query('SELECT * FROM attendance WHERE attendance_code = ?', [code], (error, rows) => {
      // Release the connection
      connection.release();
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Error fetching data' });
      }

      // Check if any rows were returned (code exists)
      if (rows.length > 0) {
        // Send success response
        res.json({ success: true });
      } else {
        // Send error response (invalid code)
        res.status(400).json({ error: 'Invalid code' });
      }
    });
  });
});

// ---------------------Attendance RFID tap history-------------------------
app.post('/attendance_history', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, email, code, date, user_id } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('INSERT INTO attendance_taphistory (attendance_firstName, attendance_middleName, attendance_Lastname, attendance_tupId, attendance_course, attendance_section, attendance_email, attendance_code,attendance_historyDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, tuptId, course, section, email, code, date, user_id], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send a success response
      res.json({ success: true, message: 'RFID tap history successfully' });
    });
  });
});

// ------------------Fetch Attendance tap history----------------------------
app.post('/attendance_tapHistory/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM attendance_taphistory WHERE user_id = ?', [userId], (error, rows) => {
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

// ---------------------Gatepass RFID tap history-------------------------
app.post('/Gatepass_history', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, deviceName, serialNumber, date, user_id } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('INSERT INTO gatepass_taphistory (gatepass_firstname, gatepass_middlename, gatepass_lastname, gatepass_tupID, gatepass_course, gatepass_section, device_name, serial_number, gatepass_historyDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, tuptId, course, section, deviceName, serialNumber, date, user_id], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send a success response
      res.json({ success: true, message: 'RFID tap history successfully' });
    });
  });
});

// ---------------------------Library RFID tap history----------------
const moment = require('moment');

// Function to format the date and time
function formatDateTime(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
  return date.toLocaleString('en-US', options);
}

// Function to format the date without time
function formatDate(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Route to handle library history updates
app.post('/library_history', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, email, user_id } = req.body;

  // Check if any of the required fields are empty strings or null
  if (!firstName || !lastName || !tuptId || !course || !section || !email || !user_id) {
    return res.status(400).json({ error: 'Required fields are missing or empty' });
  }

  const currentDateTime = formatDateTime(new Date());
  const currentDate = formatDate(new Date());

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Check the latest entry for the user
    connection.query('SELECT * FROM library_taphistory WHERE user_id = ? ORDER BY library_InHistoryDate DESC LIMIT 1', [user_id], (selectError, results) => {
      if (selectError) {
        connection.release();
        console.error('Error executing select query:', selectError);
        return res.status(500).json({ error: 'Database select query error' });
      }

      if (results.length > 0) {
        const lastEntry = results[0];
        const lastEntryDate = formatDate(new Date(lastEntry.library_InHistoryDate));

        if (lastEntryDate === currentDate && lastEntry.library_OutHistoryDate === null) {
          // Same day and the Out date is NULL, update the Out date
          connection.query('UPDATE library_taphistory SET library_OutHistoryDate = ? WHERE user_id = ? AND library_OutHistoryDate IS NULL',
            [currentDateTime, user_id], (updateError, updateResults) => {
              if (updateError) {
                connection.release();
                console.error('Error executing update query:', updateError);
                return res.status(500).json({ error: 'Database update query error' });
              }

              connection.release();
              console.log('Updated library_OutHistoryDate successfully');
              res.json({ success: true, message: 'Updated library_OutHistoryDate successfully', tapStatus: 'Out' });
            });
        } else {
          // Either a new day or the last entry already has an Out date, insert a new record
          connection.query('INSERT INTO library_taphistory (library_firstName, library_middleName, library_lastName, library_tupId, library_course, library_section, library_email, library_InHistoryDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, middleName, lastName, tuptId, course, section, email, currentDateTime, user_id], (insertError, insertResults) => {
              connection.release();
              if (insertError) {
                console.error('Error executing insert query:', insertError);
                return res.status(500).json({ error: 'Database insert query error' });
              }
              console.log('Inserted library_InHistoryDate successfully');
              res.json({ success: true, message: 'Inserted library_InHistoryDate successfully', tapStatus: 'In' });
            });
        }
      } else {
        // No previous entries, insert a new record
        connection.query('INSERT INTO library_taphistory (library_firstName, library_middleName, library_lastName, library_tupId, library_course, library_section, library_email, library_InHistoryDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [firstName, middleName, lastName, tuptId, course, section, email, currentDateTime, user_id], (insertError, insertResults) => {
            connection.release();
            if (insertError) {
              console.error('Error executing insert query:', insertError);
              return res.status(500).json({ error: 'Database insert query error' });
            }
            console.log('Inserted library_InHistoryDate successfully');
            res.json({ success: true, message: 'Inserted library_InHistoryDate successfully', tapStatus: 'In' });
          });
      }
    });
  });
});

// -------------------------Fetch Library tap history---------------------------
app.get('/library_tapHistory/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM library_taphistory WHERE user_id = ?', [userId], (error, rows) => {
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

// -------------------------Gym RFID tap history 3.0----------------
app.post('/gym_history', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, email, user_id } = req.body;

  // Check if any of the required fields are empty strings or null
  if (!firstName || !lastName || !tuptId || !course || !section || !email || !user_id) {
    return res.status(400).json({ error: 'Required fields are missing or empty' });
  }

  const currentDateTime = formatDateTime(new Date());
  const currentDate = formatDate(new Date());

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Check the latest entry for the user
    connection.query('SELECT * FROM gym_taphistory WHERE user_id = ? ORDER BY gym_InHistoryDate DESC LIMIT 1', [user_id], (selectError, results) => {
      if (selectError) {
        connection.release();
        console.error('Error executing select query:', selectError);
        return res.status(500).json({ error: 'Database select query error' });
      }

      if (results.length > 0) {
        const lastEntry = results[0];
        const lastEntryDate = formatDate(new Date(lastEntry.gym_InHistoryDate)); // Corrected from 'library_InHistoryDate'

        if (lastEntryDate === currentDate && lastEntry.gym_OutHistoryDate === null) {
          // Same day and the Out date is NULL, update the Out date
          connection.query('UPDATE gym_taphistory SET gym_OutHistoryDate = ? WHERE user_id = ? AND gym_OutHistoryDate IS NULL',
            [currentDateTime, user_id], (updateError, updateResults) => {
              if (updateError) {
                connection.release();
                console.error('Error executing update query:', updateError);
                return res.status(500).json({ error: 'Database update query error' });
              }

              connection.release();
              console.log('Updated gym_OutHistoryDate successfully');
              res.json({ success: true, message: 'Updated gym_OutHistoryDate successfully', tapStatus: 'Out' });
            });
        } else {
          // Either a new day or the last entry already has an Out date, insert a new record
          connection.query('INSERT INTO gym_taphistory (gym_firstname, gym_middlename, gym_lastname, gym_tupID, gym_course, gym_section, gym_email, gym_InHistoryDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, middleName, lastName, tuptId, course, section, email, currentDateTime, user_id], (insertError, insertResults) => {
              connection.release();
              if (insertError) {
                console.error('Error executing insert query:', insertError);
                return res.status(500).json({ error: 'Database insert query error' });
              }
              console.log('Inserted gym_InHistoryDate successfully');
              res.json({ success: true, message: 'Inserted gym_InHistoryDate successfully', tapStatus: 'In' });
            });
        }
      } else {
        // No previous entries, insert a new record
        connection.query('INSERT INTO gym_taphistory (gym_firstname, gym_middlename, gym_lastname, gym_tupID, gym_course, gym_section, gym_email, gym_InHistoryDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [firstName, middleName, lastName, tuptId, course, section, email, currentDateTime, user_id], (insertError, insertResults) => {
            connection.release();
            if (insertError) {
              console.error('Error executing insert query:', insertError);
              return res.status(500).json({ error: 'Database insert query error' });
            }
            console.log('Inserted gym_InHistoryDate successfully');
            res.json({ success: true, message: 'Inserted gym_InHistoryDate successfully', tapStatus: 'In' });
          });
      }
    });
  });
});

// -------------------------Fetch Gym tap history---------------------------
app.get('/gym_tapHistory/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM gym_taphistory WHERE user_id = ?', [userId], (error, rows) => {
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

// ---------------------Registrar RFID tap history-------------------------
app.post('/registrar_history', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, email, date, user_id } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('INSERT INTO registrar_taphistory (registrar_firstname, registrar_middlename, registrar_lastname, registrar_tupID, registrar_course, registrar_section, registrar_email, registrar_taphistoryDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, tuptId, course, section, email, date, user_id], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send a success response
      res.json({ success: true, message: 'RFID tap history successfully' });
    });
  });
});

// ----------------------Fetch Registrar tap history-------------------------
app.get('/registrar_tapHistory/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM registrar_taphistory WHERE user_id = ?', [userId], (error, rows) => {
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

// ---------------------Gatepass RFID tap history-------------------------
app.post('/gatepass_history', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, email, date, user_id } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('INSERT INTO gatepass_taphistory (gatepass_firstname, gatepass_middlename, gatepass_lastname, gatepass_tupID, gatepass_course, gatepass_section, gatepass_email, gatepass_historyDate, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, tuptId, course, section, email, date, user_id], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send a success response
      res.json({ success: true, message: 'RFID tap history successfully' });
    });
  });
});

// ----------------------Fetch Gatepass tap history-------------------------
app.get('/gatepass_tapHistory/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM gatepass_taphistory WHERE user_id = ?', [userId], (error, rows) => {
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

// Check database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully');
    connection.release();
  }
});

// Start the server
const PORT = process.env.PORT || 2525;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});