// src/controllers/communityController.js
import Community from "../models/Community.js";
import CommunityPost from "../models/CommunityPost.js";

// ------------------------------------------------------
// Helper: get current user id from request (JWT middleware)
// ------------------------------------------------------
const getUserId = (req) => {
    // adjust based on your auth middleware
    if (req.user && req.user.id) return req.user.id;
    if (req.user && req.user._id) return req.user._id;
    if (req.userId) return req.userId;
    return null;
};

// ------------------------------------------------------
// Helper: map Mongo post -> object used by Community.tsx
// ------------------------------------------------------
const mapPostToDto = (post, currentUserId) => {
    const liked = currentUserId
        ? post.likes.some(
            (id) => id.toString() === currentUserId.toString()
        )
        : false;

    return {
        id: post._id.toString(),
        authorName: post.author?.name || "Anonymous",
        // if you later add "avatar" on User model, it will be used here
        authorAvatar: post.author?.avatar || "👤",
        // frontend can convert this ISO string to "2 hours ago"
        timestamp: post.createdAt.toISOString(),
        content: post.content,
        tags: post.tags || [],
        likes: post.likes.length,
        comments: post.comments.length,
        liked,
    };
};

// ------------------------------------------------------
// COMMUNITIES
// ------------------------------------------------------

// POST /api/community
export const createCommunity = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, description, isPublic = true, tags = [] } = req.body;

        if (!name || !name.trim()) {
            return res
                .status(400)
                .json({ message: "Community name is required" });
        }

        const community = await Community.create({
            name: name.trim(),
            description,
            isPublic,
            tags,
            createdBy: userId,
            members: [userId],
        });

        res.status(201).json(community);
    } catch (err) {
        console.error("createCommunity error:", err);
        res.status(500).json({ error: "Error creating community" });
    }
};

// GET /api/community
export const getCommunities = async (req, res) => {
    try {
        const communities = await Community.find()
            .populate("createdBy", "name email")
            .select("-__v")
            .sort({ createdAt: -1 });

        res.status(200).json(communities);
    } catch (err) {
        console.error("getCommunities error:", err);
        res.status(500).json({ error: "Error fetching communities" });
    }
};

// POST /api/community/:communityId/join
export const joinCommunity = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { communityId } = req.params;

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        const isMember = community.members.some(
            (m) => m.toString() === userId.toString()
        );

        if (!isMember) {
            community.members.push(userId);
            await community.save();
        }

        res.status(200).json(community);
    } catch (err) {
        console.error("joinCommunity error:", err);
        res.status(500).json({ error: "Error joining community" });
    }
};

// POST /api/community/:communityId/leave
export const leaveCommunity = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { communityId } = req.params;

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        community.members = community.members.filter(
            (m) => m.toString() !== userId.toString()
        );
        await community.save();

        res.status(200).json(community);
    } catch (err) {
        console.error("leaveCommunity error:", err);
        res.status(500).json({ error: "Error leaving community" });
    }
};

// ------------------------------------------------------
// POSTS (connect directly to your Community.tsx UI)
// ------------------------------------------------------

// POST /api/community/:communityId/posts
export const createPost = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { communityId } = req.params;
        const { content, tags = [] } = req.body;

        if (!content || !content.trim()) {
            return res
                .status(400)
                .json({ message: "Post content is required" });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        let post = await CommunityPost.create({
            community: communityId,
            author: userId,
            content: content.trim(),
            tags,
        });

        post = await post.populate("author", "name avatar");

        const dto = mapPostToDto(post, userId);
        res.status(201).json(dto);
    } catch (err) {
        console.error("createPost error:", err);
        res.status(500).json({ error: "Error creating post" });
    }
};

// GET /api/community/:communityId/posts
export const getCommunityPosts = async (req, res) => {
    try {
        const { communityId } = req.params;
        const currentUserId = getUserId(req); // may be null for public feed

        const posts = await CommunityPost.find({ community: communityId })
            .populate("author", "name avatar")
            .populate("comments.author", "name avatar")
            .sort({ createdAt: -1 });

        const result = posts.map((p) => mapPostToDto(p, currentUserId));
        res.status(200).json(result);
    } catch (err) {
        console.error("getCommunityPosts error:", err);
        res.status(500).json({ error: "Error fetching posts" });
    }
};

// POST /api/community/posts/:postId/like
export const toggleLikePost = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { postId } = req.params;

        let post = await CommunityPost.findById(postId).populate(
            "author",
            "name avatar"
        );
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
        } else {
            post.likes.push(userId);
        }

        await post.save();

        const dto = mapPostToDto(post, userId);
        res.status(200).json(dto);
    } catch (err) {
        console.error("toggleLikePost error:", err);
        res.status(500).json({ error: "Error liking/unliking post" });
    }
};

// POST /api/community/posts/:postId/comments
export const addComment = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { postId } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res
                .status(400)
                .json({ message: "Comment text is required" });
        }

        let post = await CommunityPost.findById(postId).populate(
            "author",
            "name avatar"
        );
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            author: userId,
            text: text.trim(),
        });

        await post.save();

        await post.populate("comments.author", "name avatar");

        // you can either return full post or just success;
        // here we return the mapped DTO + comments count
        const dto = mapPostToDto(post, userId);
        res.status(201).json(dto);
    } catch (err) {
        console.error("addComment error:", err);
        res.status(500).json({ error: "Error adding comment" });
    }
};