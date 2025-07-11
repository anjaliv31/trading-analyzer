let users = [];

exports.register = (req, res) => {
  const { username, password } = req.body;
  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ message: "User already exists" });
  users.push({ username, password });
  res.json({ message: "Registered successfully" });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ access_token: "dummy-token" });
};
