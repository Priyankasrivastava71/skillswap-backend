const supabase = require("../config/supabaseClient");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const getMyNotifications = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(res,400,error.message);
  }

  return successResponse(res,200,"Notification fetched successfully",data);
};

const markAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check notification exists
  const { data: notification, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !notification) {
    return errorResponse(res, 404, "Notification not found");
  }

  // Ownership check
  if (notification.user_id !== userId) {
    return errorResponse(res, 403, "Unauthorized");
  }

  // Update notification
  const { error: updateError } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      updated_at: new Date()
    })
    .eq("id", id);

  if (updateError) {
    return errorResponse(res, 400, updateError.message);
  }

  return successResponse(
    res,
    200,
    "Notification marked as read",
    null
  );
};

module.exports = {getMyNotifications,markAsRead}