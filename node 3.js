
const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.json());

const TOTAL_SEATS = 10;
let seats = [];


for (let i = 1; i <= TOTAL_SEATS; i++) {
  seats.push({
    id: i,
    status: "available", 
    lockedBy: null,
    lockExpiry: null,
  });
}

function releaseExpiredLocks() {
  const now = Date.now();
  seats.forEach((seat) => {
    if (seat.status === "locked" && seat.lockExpiry && seat.lockExpiry < now) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockExpiry = null;
      console.log(`🔓 Lock expired for Seat ${seat.id}`);
    }
  });
}


app.get("/seats", (req, res) => {
  releaseExpiredLocks();
  res.json(seats);
});


app.post("/seats/:id/lock", (req, res) => {
  releaseExpiredLocks();

  const seatId = parseInt(req.params.id);
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const seat = seats.find((s) => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  if (seat.status === "booked") {
    return res.status(400).json({ error: "Seat already booked" });
  }

  if (seat.status === "locked" && seat.lockedBy !== userId) {
    return res.status(400).json({ error: "Seat is temporarily locked by another user" });
  }

  seat.status = "locked";
  seat.lockedBy = userId;
  seat.lockExpiry = Date.now() + 60 * 1000; // 1 minute lock

  res.json({ message: `Seat ${seatId} locked for user ${userId} for 1 minute`, seat });
});

app.post("/seats/:id/confirm", (req, res) => {
  releaseExpiredLocks();

  const seatId = parseInt(req.params.id);
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const seat = seats.find((s) => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  if (seat.status === "available") {
    return res.status(400).json({ error: "Seat is not locked yet" });
  }

  if (seat.status === "locked" && seat.lockedBy !== userId) {
    return res.status(400).json({ error: "You cannot confirm this seat, it's locked by another user" });
  }

  if (seat.status === "locked" && seat.lockedBy === userId) {
    seat.status = "booked";
    seat.lockedBy = null;
    seat.lockExpiry = null;
    return res.json({ message: `✅ Seat ${seatId} successfully booked by ${userId}`, seat });
  }

  if (seat.status === "booked") {
    return res.status(400).json({ error: "Seat already booked" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎟️ Ticket Booking System running at http://localhost:${PORT}`);
});
