const bcrypt = require("bcrypt");
const supabase = require("../config/supabaseClient");
const generateToken = require("../utils/generateToken");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!(password.length === 6 || password.length === 8)) {
  return res.status(400).json({
    error: "Password must be exactly 6 or 8 characters long"
  });
}

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        { name, email, password: hashedPassword }
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = generateToken(data[0]);

    const { password: _, ...userWithoutPassword } = data[0];

return successResponse(
  res,
  201,
  "User registered successfully",
  { token, user: userWithoutPassword }
);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
     return errorResponse(res, 400, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return errorResponse(res, 400, "Invalid credentials");
    }

    const token = generateToken(data);

    const { password: _, ...userWithoutPassword } = data;

return successResponse(
  res,
  200,
  "Login successful",
  { token, user: userWithoutPassword }
);

  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

module.exports = { registerUser, loginUser };