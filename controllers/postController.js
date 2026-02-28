const supabase = require("../config/supabaseClient");
const { errorResponse, successResponse } = require("../utils/responseHandler");

// ==========================
// CREATE POST
// ==========================
const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;

  if (!content) {
    return errorResponse(res, 400, "Content is required");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        user_id: userId,
        title,
        content
      }
    ])
    .select(`
      *,
      user:user_id ( id, name )
    `)
    .single();

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(
    res,
    201,
    "Post created successfully",
    data
  );
};

// ==========================
// GET ALL POSTS (WITH COMMENTS + USER)
// ==========================
const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("posts")
    .select(`
      *,
      user:user_id ( id, name ),
      comments (
        *,
        user:user_id ( id, name )
      )
    `, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(res, 400, error.message);
  }

  return successResponse(
    res,
    200,
    "Posts fetched successfully",
    {
      totalPosts: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      posts: data
    }
  );
};

// ==========================
// DELETE POST
// ==========================
const deletePost = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    return errorResponse(res, 404, "Post not found");
  }

  if (post.user_id !== userId) {
    return errorResponse(
      res,
      403,
      "You can only delete your own post"
    );
  }

  await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  return successResponse(
    res,
    200,
    "Post deleted successfully"
  );
};

module.exports = {
  createPost,
  getAllPosts,
  deletePost
};