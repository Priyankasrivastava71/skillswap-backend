const supabase = require("../config/supabaseClient");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const giveFeedback = async (req, res) => {
  const userId = req.user.id;
  const { request_id, rating, comment } = req.body;

  // Basic validation
  if (!request_id || !rating) {
    return errorResponse(res, 400, "Request ID and rating are required");
  }

  if (rating < 1 || rating > 5) {
    return errorResponse(res, 400, "Rating must be between 1 and 5");
  }

  // Check request exists
  const { data: request, error: requestError } = await supabase
    .from("requests")
    .select("*")
    .eq("id", request_id)
    .single();

  if (requestError || !request) {
    return errorResponse(res, 400, "Invalid request");
  }

  // Only accepted sessions can give feedback
  if (request.session_status !== "completed") {
    return errorResponse(res, 400, "Session not completed yet");
  }

  // Check if user is part of this session
  if (
    request.sender_id !== userId &&
    request.receiver_id !== userId
  ) {
    return errorResponse(res, 403, "You are not part of this session");
  }

  // Determine who receives rating
  const givenTo =
    request.sender_id === userId
      ? request.receiver_id
      : request.sender_id;

  // Check if feedback already exists
  const { data: existingFeedback } = await supabase
    .from("feedback")
    .select("*")
    .eq("request_id", request_id)
    .eq("given_by", userId);

  if (existingFeedback && existingFeedback.length > 0) {
    return errorResponse(res, 400, "Feedback already submitted");
  }

  // Insert feedback
  const { data: feedbackData, error } = await supabase
    .from("feedback")
    .insert([
      {
        request_id,
        given_by: userId,
        given_to: givenTo,
        rating,
        comment
      }
    ])
    .select();

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  // Recalculate average rating
  const { data: ratings } = await supabase
    .from("feedback")
    .select("rating")
    .eq("given_to", givenTo);

  const total = ratings.reduce((sum, r) => sum + r.rating, 0);
  const avgRating =
    ratings.length > 0 ? total / ratings.length : rating;

  // Update user rating
  await supabase
    .from("users")
    .update({
      rating: avgRating,
      updated_at: new Date()
    })
    .eq("id", givenTo);

  // Create notification
  await supabase
    .from("notifications")
    .insert([
      {
        user_id: givenTo,
        type: "feedback",
        message: "You received new feedback",
        related_id: feedbackData[0].id
      }
    ]);

  return successResponse(
    res,
    201,
    "Feedback submitted and rating updated",
    feedbackData[0]
  );
};

const getFeedbackForUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const feedbacks = await Feedback.find({ toUser: userId })
      .populate("fromUser", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: feedbacks });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { giveFeedback, getFeedbackForUser };