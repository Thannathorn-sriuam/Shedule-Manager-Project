// const express = require('express');
// const bodyParser = require('body-parser');
// const csv = require('fast-csv');
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');
// const mysql = require('mysql2/promise');

// // Create Express app
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Multer setup for file upload
// const upload = multer({ dest: 'uploads/' });

// // MySQL connection setup using async connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '12354678ii',
//   database: 'icttable',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Function to insert professor into database if not exists and return the id
// const insertProfessor = async (name) => {
//   const trimmedName = name.trim();
//   const [results] = await pool.query(`INSERT INTO professors (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`, [trimmedName]);
//   return results.insertId;
// };

// // Function to insert subject into database if not exists
// const insertIntoSubject = async (subjectId, subjectName, subjectType) => {
//   const query = `INSERT INTO Subject (Subject_ID, Subject_Name, Subject_Type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Subject_Name = VALUES(Subject_Name), Subject_Type = VALUES(Subject_Type)`;
//   await pool.query(query, [subjectId, subjectName, subjectType, subjectName, subjectType]);
// };

// // Function to insert data into the slot and associate professors
// const insertIntoSlot = async (row, subjectId, subjectType, lectValue, labValue) => {
//   const baseValues = [
//     row.Course, row.C_Year, row.Num, subjectId, row.Subject_Name,
//     lectValue, labValue, row.Sec, '1', null, null, null
//   ];

//   const sections = [
//     { section: '1', value: row.Sec1 },
//     { section: '2', value: row.Sec2 },
//     { section: '3', value: row.Sec3 },
//     { section: '4', value: row.Sec4 }
//   ];

//   let insertedSlotIds = [];

//   for (const { section, value } of sections) {
//     if (value) {
//       const values = [...baseValues, section, subjectType];
//       const query = `INSERT INTO slot (Course, C_Year, Num, Subject_ID, Subject_Name, Lect, Lab, Sec, Duration, Date, Time, Room_id, Section, Subject_Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//       try {
//         const [result] = await pool.query(query, values);
//         insertedSlotIds.push(result.insertId);
//       } catch (err) {
//         console.error('Error inserting data into MySQL: ', err);
//       }
//     }
//   }

//   if (!sections.some(({ value }) => value)) {
//     const values = [...baseValues, 'All Sec', subjectType];
//     const query = `INSERT INTO slot (Course, C_Year, Num, Subject_ID, Subject_Name, Lect, Lab, Sec, Duration, Date, Time, Room_id, Section, Subject_Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     try {
//       const [result] = await pool.query(query, values);
//       insertedSlotIds.push(result.insertId);
//     } catch (err) {
//       console.error('Error inserting data into MySQL: ', err);
//     }
//   }

//   const professorSections = [row.Sec1, row.Sec2, row.Sec3, row.Sec4, row.C_All].filter(Boolean);
//   for (let professorSection of professorSections) {
//     let names = professorSection.split('/');
//     for (let name of names) {
//       try {
//         const trimmedName = name.trim();
//         const [professorResult] = await pool.query('SELECT id FROM professors WHERE name = ?', [trimmedName]);
//         let professorId = professorResult[0] ? professorResult[0].id : null;

//         if (!professorId) {
//           const [insertResult] = await pool.query('INSERT INTO professors (name) VALUES (?)', [trimmedName]);
//           professorId = insertResult.insertId;
//         }

//         for (let slotId of insertedSlotIds) {
//           await pool.query('INSERT INTO professor_slot (slot_id, professor_id) VALUES (?, ?)', [slotId, professorId]);
//         }
//       } catch (err) {
//         console.error('Error handling professor data: ', err);
//       }
//     }
//   }

//   return insertedSlotIds;
// };

// // Route for file upload
// app.post('/api/import-csv', upload.single('file'), async (req, res) => {
//   const filePath = path.join(__dirname, req.file.path);

//   try {
//     const data = await fs.promises.readFile(filePath, 'utf8');
//     const records = csv.parseString(data, { headers: true });
//     for await (const row of records) {
//       if (row.Lect && !row.Lab) {
//         await insertIntoSlot(row, row.Subject_ID, 'Lect', row.Lect, null);
//         await insertIntoSubject(row.Subject_ID, row.Subject_Name, 'Lect');
//       } else if (!row.Lect && row.Lab) {
//         await insertIntoSlot(row, `${row.Subject_ID}(Lab)`, 'Lab', null, row.Lab);
//         await insertIntoSubject(`${row.Subject_ID}(Lab)`, row.Subject_Name, 'Lab');
//       } else if (row.Lect && row.Lab) {
//         await insertIntoSlot(row, row.Subject_ID, 'Lect', row.Lect, null);
//         await insertIntoSlot(row, `${row.Subject_ID}(Lab)`, 'Lab', null, row.Lab);
//         await insertIntoSubject(row.Subject_ID, row.Subject_Name, 'Lect');
//         await insertIntoSubject(`${row.Subject_ID}(Lab)`, row.Subject_Name, 'Lab');
//       }
//     }
//     fs.unlinkSync(filePath);
//     res.send('CSV file successfully processed');
//   } catch (err) {
//     console.error('Error processing CSV file: ', err);
//     res.status(500).send('Failed to process CSV file');
//   }
// });

// // Endpoint to get years based on program
// app.get('/api/years/:program', async (req, res) => {
//   const program = req.params.program;
//   try {
//     const [results] = await pool.query('SELECT DISTINCT C_Year FROM slot WHERE Course = ?', [program]);
//     const years = results.map(result => result.C_Year);
//     res.json(years);
//   } catch (err) {
//     console.error('Error fetching years from MySQL: ', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Endpoint to get sections based on program and year
// app.get('/api/sections/:program/:year', async (req, res) => {
//   const { program, year } = req.params;
//   try {
//     const [results] = await pool.query('SELECT DISTINCT Section FROM slot WHERE Course = ? AND C_Year = ?', [program, year]);
//     const sections = results.map(result => result.Section);
//     res.json(sections);
//   } catch (err) {
//     console.error('Error fetching sections from MySQL: ', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Endpoint to get slots based on program, year, and section
// app.get('/api/slots/:program/:year/:section', async (req, res) => {
//   const { program, year, section } = req.params;
//   try {
//     const [results] = await pool.query('SELECT slot_id, Subject_ID, Subject_Name, Subject_Type FROM slot WHERE Course = ? AND C_Year = ? AND Section = ?', [program, year, section]);
//     res.json(results);
//   } catch (err) {
//     console.error('Error fetching slots from MySQL: ', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.post('/api/update-slot-date', async (req, res) => {
//   const { slotId, date } = req.body;
//   console.log(`Received request to update slot date: ${slotId} ${date}`);
//   try {
//     const [results] = await pool.query('UPDATE slot SET Date = ? WHERE slot_id = ?', [date, slotId]);
//     res.json({ message: 'Slot date updated successfully' });
//   } catch (err) {
//     console.error('Error updating slot date:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/api/update-slot-duration', async (req, res) => {
//   const { slotId, duration } = req.body;
//   try {
//     await pool.query('UPDATE slot SET Duration = ? WHERE slot_id = ?', [duration, slotId]);
//     res.json({ message: 'Slot duration updated successfully' });
//   } catch (err) {
//     console.error('Error updating slot duration:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/api/update-slot-date-time', async (req, res) => {
//   const { slotId, date, time } = req.body;
//   console.log(`Received request to update slot date and time: ${slotId} ${date} ${time}`);
//   try {
//     const [results] = await pool.query('UPDATE slot SET Date = ?, Time = ? WHERE slot_id = ?', [date, time, slotId]);
//     res.json({ message: 'Slot date and time updated successfully' });
//   } catch (err) {
//     console.error('Error updating slot date and time:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/api/update-slot-duration-time', async (req, res) => {
//   const { slotId, duration, time } = req.body;
//   try {
//     const [results] = await pool.query('UPDATE slot SET Duration = ?, Time = ? WHERE slot_id = ?', [duration, time, slotId]);
//     res.json({ message: 'Slot duration and time updated successfully' });
//   } catch (err) {
//     console.error('Error updating slot duration and time:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Endpoint to get rooms
// app.get('/api/rooms', async (req, res) => {
//   try {
//     const [results] = await pool.query('SELECT id, name FROM rooms');
//     res.json(results);
//   } catch (err) {
//     console.error('Error fetching rooms from MySQL:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mysql = require('mysql2/promise');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// MySQL connection setup using async connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12354678ii',
  database: 'icttable',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to insert professor into database if not exists and return the id
const insertProfessor = async (name) => {
  const trimmedName = name.trim();
  const [results] = await pool.query(`INSERT INTO professors (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`, [trimmedName]);
  return results.insertId;
};

// Function to insert subject into database if not exists
const insertIntoSubject = async (subjectId, subjectName, subjectType) => {
  const query = `INSERT INTO Subject (Subject_ID, Subject_Name, Subject_Type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Subject_Name = VALUES(Subject_Name), Subject_Type = VALUES(Subject_Type)`;
  await pool.query(query, [subjectId, subjectName, subjectType, subjectName, subjectType]);
};

// Function to insert data into the slot and associate professors
const insertIntoSlot = async (row, subjectId, subjectType, lectValue, labValue) => {
  const baseValues = [
    row.Course, row.C_Year, row.Num, subjectId, row.Subject_Name,
    lectValue, labValue, row.Sec, '1', null, null, null
  ];

  const sections = [
    { section: '1', value: row.Sec1 },
    { section: '2', value: row.Sec2 },
    { section: '3', value: row.Sec3 },
    { section: '4', value: row.Sec4 }
  ];

  let insertedSlotIds = [];

  for (const { section, value } of sections) {
    if (value) {
      const values = [...baseValues, section, subjectType];
      const query = `INSERT INTO slot (Course, C_Year, Num, Subject_ID, Subject_Name, Lect, Lab, Sec, Duration, Date, Time, Room_id, Section, Subject_Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      try {
        const [result] = await pool.query(query, values);
        insertedSlotIds.push(result.insertId);
      } catch (err) {
        console.error('Error inserting data into MySQL: ', err);
      }
    }
  }

  if (!sections.some(({ value }) => value)) {
    const values = [...baseValues, 'All Sec', subjectType];
    const query = `INSERT INTO slot (Course, C_Year, Num, Subject_ID, Subject_Name, Lect, Lab, Sec, Duration, Date, Time, Room_id, Section, Subject_Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      const [result] = await pool.query(query, values);
      insertedSlotIds.push(result.insertId);
    } catch (err) {
      console.error('Error inserting data into MySQL: ', err);
    }
  }

  const professorSections = [row.Sec1, row.Sec2, row.Sec3, row.Sec4, row.C_All].filter(Boolean);
  for (let professorSection of professorSections) {
    let names = professorSection.split('/');
    for (let name of names) {
      try {
        const trimmedName = name.trim();
        const [professorResult] = await pool.query('SELECT id FROM professors WHERE name = ?', [trimmedName]);
        let professorId = professorResult[0] ? professorResult[0].id : null;

        if (!professorId) {
          const [insertResult] = await pool.query('INSERT INTO professors (name) VALUES (?)', [trimmedName]);
          professorId = insertResult.insertId;
        }

        for (let slotId of insertedSlotIds) {
          await pool.query('INSERT INTO professor_slot (slot_id, professor_id) VALUES (?, ?)', [slotId, professorId]);
        }
      } catch (err) {
        console.error('Error handling professor data: ', err);
      }
    }
  }

  return insertedSlotIds;
};

// Route for file upload
app.post('/api/import-csv', upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const records = csv.parseString(data, { headers: true });
    for await (const row of records) {
      if (row.Lect && !row.Lab) {
        await insertIntoSlot(row, row.Subject_ID, 'Lect', row.Lect, null);
        await insertIntoSubject(row.Subject_ID, row.Subject_Name, 'Lect');
      } else if (!row.Lect && row.Lab) {
        await insertIntoSlot(row, `${row.Subject_ID}(Lab)`, 'Lab', null, row.Lab);
        await insertIntoSubject(`${row.Subject_ID}(Lab)`, row.Subject_Name, 'Lab');
      } else if (row.Lect && row.Lab) {
        await insertIntoSlot(row, row.Subject_ID, 'Lect', row.Lect, null);
        await insertIntoSlot(row, `${row.Subject_ID}(Lab)`, 'Lab', null, row.Lab);
        await insertIntoSubject(row.Subject_ID, row.Subject_Name, 'Lect');
        await insertIntoSubject(`${row.Subject_ID}(Lab)`, row.Subject_Name, 'Lab');
      }
    }
    fs.unlinkSync(filePath);
    res.send('CSV file successfully processed');
  } catch (err) {
    console.error('Error processing CSV file: ', err);
    res.status(500).send('Failed to process CSV file');
  }
});

// Endpoint to get years based on program
app.get('/api/years/:program', async (req, res) => {
  const program = req.params.program;
  try {
    const [results] = await pool.query('SELECT DISTINCT C_Year FROM slot WHERE Course = ?', [program]);
    const years = results.map(result => result.C_Year);
    res.json(years);
  } catch (err) {
    console.error('Error fetching years from MySQL: ', err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get sections based on program and year
app.get('/api/sections/:program/:year', async (req, res) => {
  const { program, year } = req.params;
  try {
    const [results] = await pool.query('SELECT DISTINCT Section FROM slot WHERE Course = ? AND C_Year = ?', [program, year]);
    const sections = results.map(result => result.Section);
    res.json(sections);
  } catch (err) {
    console.error('Error fetching sections from MySQL: ', err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get slots based on program, year, and section
app.get('/api/slots/:program/:year/:section', async (req, res) => {
  const { program, year, section } = req.params;
  try {
    const [results] = await pool.query('SELECT slot_id, Subject_ID, Subject_Name, Subject_Type FROM slot WHERE Course = ? AND C_Year = ? AND Section = ?', [program, year, section]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching slots from MySQL: ', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/update-slot-date', async (req, res) => {
  const { slotId, date } = req.body;
  console.log(`Received request to update slot date: ${slotId} ${date}`);
  try {
    const [results] = await pool.query('UPDATE slot SET Date = ? WHERE slot_id = ?', [date, slotId]);
    res.json({ message: 'Slot date updated successfully' });
  } catch (err) {
    console.error('Error updating slot date:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/update-slot-duration', async (req, res) => {
  const { slotId, duration } = req.body;
  try {
    await pool.query('UPDATE slot SET Duration = ? WHERE slot_id = ?', [duration, slotId]);
    res.json({ message: 'Slot duration updated successfully' });
  } catch (err) {
    console.error('Error updating slot duration:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/update-slot-date-time', async (req, res) => {
  const { slotId, date, time } = req.body;
  console.log(`Received request to update slot date and time: ${slotId} ${date} ${time}`);
  try {
    const [results] = await pool.query('UPDATE slot SET Date = ?, Time = ? WHERE slot_id = ?', [date, time, slotId]);
    res.json({ message: 'Slot date and time updated successfully' });
  } catch (err) {
    console.error('Error updating slot date and time:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/update-slot-duration-time', async (req, res) => {
  const { slotId, duration, time, room } = req.body;
  try {
    const [results] = await pool.query('UPDATE slot SET Duration = ?, Time = ?, Room_id = ? WHERE slot_id = ?', [duration, time, room, slotId]);
    res.json({ message: 'Slot duration, time, and room updated successfully' });
  } catch (err) {
    console.error('Error updating slot duration, time, and room:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.use(express.static(path.join(__dirname, 'public'))); // เส้นทางสำหรับไฟล์ static

// ตรวจสอบให้แน่ใจว่าเส้นทาง API ถูกต้องและอยู่เหนือการกำหนดค่า static
app.get('/api/rooms', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT name FROM rooms');
    res.json(results);
  } catch (err) {
    console.error('Error fetching rooms from MySQL:', err);
    res.status(500).send('Internal Server Error');
  }
});

// เส้นทางอื่น ๆ
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.post('/api/update-slot-duration-time', async (req, res) => {
  const { slotId, duration, time, room } = req.body;
  try {
    const [results] = await pool.query('UPDATE slot SET Duration = ?, Time = ?, Room_id = ? WHERE slot_id = ?', [duration, time, room, slotId]);
    res.json({ message: 'Slot duration, time, and room updated successfully' });
  } catch (err) {
    console.error('Error updating slot duration, time, and room:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/subjects', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT Subject_ID, Subject_Name FROM Subject');
    res.json(results);
  } catch (err) {
    console.error('Error fetching subjects from MySQL:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to add new slot
app.post('/api/add-slot', async (req, res) => {
  const { Course, C_Year, Section, Subject_ID, Subject_Name, Subject_Type } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO slot (Course, C_Year, Section, Subject_ID, Subject_Name, Subject_Type) VALUES (?, ?, ?, ?, ?, ?)',
      [Course, C_Year, Section, Subject_ID, Subject_Name, Subject_Type]
    );
    res.json({ insertId: result.insertId });
  } catch (err) {
    console.error('Error adding new slot:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT Subject_ID, Subject_Name FROM Subject');
    res.json(results);
  } catch (err) {
    console.error('Error fetching subjects from MySQL:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
