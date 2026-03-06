const supabase = require("../config/supabaseClient");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const normalizeSkills = (skills) => {
  if (!skills) return [];

  return skills.map((skill) => skill.toLowerCase().replace(/\./g, "").trim());
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { bio, skills_offered, skills_wanted } = req.body;

  const normalizedOffered = normalizeSkills(skills_offered);
  const normalizedWanted = normalizeSkills(skills_wanted);

  const { data, error } = await supabase
    .from("users")
    .update({
      bio,
      skills_offered: normalizedOffered,
      skills_wanted: normalizedWanted,
      updated_at: new Date(),
    })
    .eq("id", userId)
    .select()
    .single();
  //
  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(res, 200, "Profile updated successfully", data);
};

const getAllUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, bio, skills_offered, skills_wanted, rating");

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(res, 200, "Users fetched successfully", data);
};

const getMatches = async (req, res) => {
  const userId = req.user.id;

  // Get current user
  const { data: currentUser, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    return errorResponse(res, 400, error.message);
  }

  const wantedSkills = currentUser.skills_wanted || [];

  if (wantedSkills.length === 0) {
    return successResponse(res, 200, "No Skills added yet", []);
  }

  // Find users whose skills_offered overlaps with my skills_wanted
  const { data: matchedUsers, error } = await supabase
    .from("users")
    .select("id, name, bio, skills_offered, skills_wanted, rating")
    .neq("id", userId)
    .overlaps("skills_offered", wantedSkills);

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(
    res,
    200,
    "Matched users fetched successfully",
    matchedUsers,
  );
};

//Search users By Skill
const searchUsersBySkill = async (req, res) => {
  const { skill } = req.query;

  if (!skill) {
    return errorResponse(res, 400, "Skill query is required");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`skills_offered.cs.{${skill}},skills_wanted.cs.{${skill}}`);

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(res, 200, "Users fetched successfully", data);
};

//Sort users by rating
const getTopRatedUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, skills_offered, rating")
    .gt("rating", 0) // only users with rating > 0
    .order("rating", { ascending: false })
    .limit(5);

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(
    res,
    200,
    "Top rated users fetched successfully",
    data,
  );
};
//For profile
const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) {
      return errorResponse(res, 400, error.message);
    }

    const { password, ...userWithoutPassword } = data;

    return successResponse(
      res,
      200,
      "Profile fetched successfully",
      userWithoutPassword,
    );
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  const { password, ...userWithoutPassword } = data;

  return successResponse(
    res,
    200,
    "User fetched successfully",
    userWithoutPassword,
  );
};

module.exports = {
  updateProfile,
  getAllUsers,
  getMatches,
  searchUsersBySkill,
  getTopRatedUsers,
  getProfile,
  getUserById,
};
