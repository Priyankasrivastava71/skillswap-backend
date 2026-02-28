const supabase = require("../config/supabaseClient");
const { errorResponse, successResponse } = require("../utils/responseHandler");

// Add Resource
const addResource = async (req, res) => {
  const userId = req.user.id;
  const { title, link, description } = req.body;

  const { data, error } = await supabase
    .from("resources")
    .insert([
      {
        user_id: userId,
        title,
        link,
        description
      }
    ])
    .select();

  if (error) {
    return errorResponse(res,400,error.message);
  }

  return successResponse(res,201,"Resource added successfully",data[0]);
};

// Get All Resources
const getAllResources = async (req, res) => {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(res,400,error.message);
  }

  return successResponse(res, 200, "Resources fetched successfully",data)
};

module.exports = { addResource, getAllResources };