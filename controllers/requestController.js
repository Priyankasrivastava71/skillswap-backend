const supabase = require("../config/supabaseClient");
const { errorResponse, successResponse } = require("../utils/responseHandler");

// Send Request
const sendRequest = async (req, res) => {
  const senderId = req.user.id;
  const { receiver_id, skill_requested, scheduled_date } = req.body;

  if (!receiver_id || !skill_requested || !scheduled_date) {
    return errorResponse(res, 400, "All fields are required");
  }

  if (senderId === receiver_id) {
    return errorResponse(res, 400, "You cannot send request to yourself");
  }

  // Prevent duplicate requests
  const { data: existing, error: existingError } = await supabase
    .from("requests")
    .select("*")
    .eq("sender_id", senderId)
    .eq("receiver_id", receiver_id)
    .eq("skill_requested", skill_requested)
    .in("status", ["pending", "accepted"]);

  if (existingError) {
    return errorResponse(res, 500, existingError.message);
  }

  if (existing && existing.length > 0) {
    return errorResponse(res, 400, "Request already sent");
  }

  // Create request
  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        sender_id: senderId,
        receiver_id,
        skill_requested,
        scheduled_date,
      },
    ])
    .select()
    .single();

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  // Send notification
  await supabase.from("notifications").insert([
    {
      user_id: receiver_id,
      type: "request",
      message: `${req.user.name} sent you a skill exchange request`,
      related_id: data.id,
    },
  ]);

  return successResponse(res, 201, "Request sent successfully", data);
};

// Get My Requests
const getMyRequests = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("requests")
    .select(`
      *,
      sender:sender_id ( id, name ),
      receiver:receiver_id ( id, name ),
      feedback:feedback ( id, given_by )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  const formatted = data.map((reqItem) => ({
    ...reqItem,
    isSender: reqItem.sender_id === userId,
    isReceiver: reqItem.receiver_id === userId,
    otherUser:
      reqItem.sender_id === userId ? reqItem.receiver : reqItem.sender,
  }));

  return successResponse(res, 200, "Requests fetched successfully", formatted);
};

// Accept / Reject Request
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("requests")
    .update({
      status,
      updated_at: new Date(),
    })
    .eq("id", id)
    .eq("receiver_id", userId)
    .select()
    .single();

  if (error || !data) {
    return errorResponse(res, 404, "Request not found or unauthorized");
  }

  if (status === "accepted") {
    await supabase.from("notifications").insert([
      {
        user_id: data.sender_id,
        type: "accepted",
        message: `${req.user.name} accepted your skill request for ${data.skill_requested}`,
        related_id: id,
      },
    ]);
  }

  return successResponse(res, 200, "Request updated successfully", data);
};

// Schedule Session
const scheduleSession = async (req, res) => {
  const { id } = req.params;
  const {
    session_date,
    session_time,
    duration,
    session_mode,
    meeting_link,
  } = req.body;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return errorResponse(res, 404, "Request not found");
    }

    if (existing.status !== "accepted") {
      return errorResponse(res, 400, "Request must be accepted first");
    }

    if (
      existing.sender_id !== req.user.id &&
      existing.receiver_id !== req.user.id
    ) {
      return errorResponse(
        res,
        403,
        "You are not authorized to schedule this session"
      );
    }

    const { data, error } = await supabase
      .from("requests")
      .update({
        session_date,
        session_time,
        duration,
        session_mode,
        meeting_link,
        session_status: "scheduled",
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse(res, 400, error.message);
    }

    const otherUser =
      existing.sender_id === req.user.id
        ? existing.receiver_id
        : existing.sender_id;

    await supabase.from("notifications").insert([
      {
        user_id: otherUser,
        type: "session",
        message: `${req.user.name} scheduled a session for ${data.skill_requested}`,
        related_id: id,
      },
    ]);

    return successResponse(res, 200, "Session scheduled successfully", data);
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

// Mark Session Completed
const markSessionCompleted = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: existing, error } = await supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !existing) {
      return errorResponse(res, 404, "Request not found");
    }

    if (existing.sender_id !== userId && existing.receiver_id !== userId) {
      return errorResponse(res, 403, "Unauthorized");
    }

    if (existing.session_status !== "scheduled") {
      return errorResponse(res, 400, "Session not scheduled yet");
    }

    const { data, updateError } = await supabase
      .from("requests")
      .update({
        session_status: "completed",
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return errorResponse(res, 400, updateError.message);
    }

    return successResponse(res, 200, "Session marked as completed", data);
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

module.exports = {
  sendRequest,
  getMyRequests,
  updateRequestStatus,
  scheduleSession,
  markSessionCompleted,
};