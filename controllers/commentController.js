const supabase = require("../config/supabaseClient");
const { errorResponse, successResponse } = require("../utils/responseHandler");

// Add Comment
const addComment = async (req, res) => {
  const userId = req.user.id;
  const { post_id, content } = req.body;

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id,
        user_id: userId,
        content
      }
    ])
    .select();

  if (error) {
    return errorResponse(res,400, error.message);
  }

  return successResponse(res,
    201,
    "Comment added successfully",
    data[0]
  );
};

// Get Comments For Post
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      user:user_id ( id, name )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(
    res,
    200,
    "Comment fetched successfully",
    data
  );
};

// Delete comment
const deleteComment = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const { data: comment, error } = await supabase
    .from("comments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !comment) {
    return errorResponse(res,400,"Comment not found");
  }

  if (comment.user_id !== userId) {
    return errorResponse(res,403,"You can only delete your own comment"
    );
  }

  await supabase
    .from("comments")
    .delete()
    .eq("id", id);

  return successResponse(res,200,"Comment deleted successfully",null);
};

module.exports = { addComment, getCommentsByPost, deleteComment };