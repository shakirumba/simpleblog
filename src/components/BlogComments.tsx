import { useState, useEffect, useRef  } from 'react';
import { supabase } from '../lib/supabaseClient';


export default function BlogComments({ blogId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
 
      useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
          setCurrentUserId(data?.user?.id ?? null);
        });
      }, []);
      
  const handleEdit = async (commentId) => {
  if (!editedContent.trim()) return;

  const { data, error } = await supabase
    .from('comments')
    .update({ content: editedContent })
    .eq('id', commentId)
    .select();

  if (error) {
    alert(error.message);
    return;
  }

    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? data[0] : c))
    );

    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleDelete = async (commentId) => {
  const confirmed = confirm('Delete this comment?');
  if (!confirmed) return;

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    alert(error.message);
    return;
  }

  setComments((prev) => prev.filter((c) => c.id !== commentId));
};
  
    const fileInputRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users(
            auth_id,
            username,
            role
          )
        `)
        .eq('blog_id', blogId)
        .order('created_at', { ascending: true });

      if (error) console.error(error);
      else setComments(data);
    };
    fetchComments();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && !commentImage) return;

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert('You must be logged in to comment.');
      setLoading(false);
      return;
    }

    let imageUrl = null;

    if (commentImage) {
      const fileName = `${Date.now()}-${commentImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from('comment-images')
        .upload(fileName, commentImage);

      if (uploadError) {
        console.error(uploadError);
        alert('Failed to upload image.');
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('comment-images')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          blog_id: blogId,
          user_id: userData.user.id,
          content: newComment,
          image_url: imageUrl,
        },
      ])
      .select(`
        *,
        users(auth_id, username, role)
      `);

    if (error) alert(error.message);
    else setComments([...comments, ...data]);

    setNewComment('');
    setCommentImage(null);
    setLoading(false);
    if (fileInputRef.current) {
    fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-white font-bold text-xl mb-4">Comments</h3>

      {/* Comment list */}
      <div className="mb-4 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-3 bg-gray-800 rounded">
            <div className="flex items-center gap-x-2">
              <img
                alt="avatar"
                src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=crop&w=32&h=32"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-white font-semibold">{c.users?.username || 'Anonymous'}:</p>
            </div>
           {editingCommentId === c.id ? (
              <div className="mt-2">
                <input
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-gray-700 text-white"
                />
                <div className="flex gap-3 mt-2 text-xs">
                  <button
                    onClick={() => handleEdit(c.id)}
                    className="text-green-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-200 mt-1">{c.content}</p>
            )}


            {c.image_url && (
              <img
                src={c.image_url}
                alt="Comment attachment"
                className="mt-2 w-48 h-48 object-cover rounded-md"
              />
            )}

            <span className="text-gray-400 text-xs block mt-1">
              {new Date(c.created_at).toLocaleString()}
            </span>
            {currentUserId === c.user_id && (
            <div className="flex gap-3 mt-1 text-xs">
              <button
                onClick={() => {
                  setEditingCommentId(c.id);
                  setEditedContent(c.content);
                }}
                className="text-blue-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          )}

          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white flex-1"
        />
        <input
                type="file"
                accept="image/*"
                ref={fileInputRef}  
                onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
                className="text-sm text-gray-300"
                />
        {commentImage && (
          <img
            src={URL.createObjectURL(commentImage)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 rounded text-white mt-2"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
