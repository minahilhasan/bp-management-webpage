const express = require("express");
const { db } = require('../db');
const nodemailer = require("nodemailer");
const cron = require("node-cron");
require("dotenv").config();

const router = express.Router();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/add", (req, res) => {
  const { user_id, email, medicine_name, reminder_time, repeat_daily } = req.body;
  db.run(
    `INSERT INTO reminders (user_id, email, medicine_name, reminder_time, repeat_daily) VALUES (?, ?, ?, ?, ?)`,
    [user_id, email, medicine_name, reminder_time, repeat_daily ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ id: this.lastID, message: "Reminder added successfully!" });
    }
  );
});

router.put("/update/:id", (req, res) => {
  const { medicine_name, reminder_time, repeat_daily } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE reminders 
     SET medicine_name = ?, 
         reminder_time = ?, 
         repeat_daily = ?, 
         sent = 0
     WHERE id = ?`,
    [medicine_name, reminder_time, repeat_daily ? 1 : 0, id],
    function (err) {
      if (err) {
        console.error("Error updating reminder:", err);
        return res.status(500).json({ message: "Failed to update reminder" });
      }
      res.json({ message: "Reminder updated successfully" });
    }
  );
});


router.get("/:user_id", (req, res) => {
  const { user_id } = req.params;
  db.all(
    `SELECT * FROM reminders WHERE user_id = ? ORDER BY reminder_time ASC`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(rows);
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM reminders WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Reminder deleted successfully" });
  });
});


cron.schedule("* * * * *", () => {
  const now = new Date();
  const current = now.toISOString().slice(0, 16);

  db.all(
    `SELECT * FROM reminders WHERE reminder_time <= ? AND sent = 0`,
    [current],
    (err, reminders) => {
      if (err) return console.error(err);

      reminders.forEach((reminder) => {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: reminder.email,
          subject: "Medicine Reminder",
          text: `Alert!! It's time to take your medicine: ${reminder.medicine_name}. 💊`,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (!error) {
            if (reminder.repeat_daily) {
              const nextDay = new Date(reminder.reminder_time);
              nextDay.setDate(nextDay.getDate() + 1);

              db.run(
                `UPDATE reminders SET reminder_time = ?, sent = 0 WHERE id = ?`,
                [nextDay.toISOString().slice(0, 16), reminder.id]
              );
              console.log(`Daily reminder rescheduled for ${reminder.email}`);
            } else {
              db.run(`UPDATE reminders SET sent = 1 WHERE id = ?`, [
                reminder.id,
              ]);
              console.log(`One-time reminder sent to ${reminder.email}`);
            }
          } else {
            console.error("Email error:", error);
          }
        });
      });
    }
  );
});

module.exports = router;
