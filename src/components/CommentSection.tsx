
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  author: string;
  author_avatar: string;
  created_at: string;
  likes: number;
  dislikes: number;
}

interface CommentSectionProps {
  videoId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    
    // Mock comment submission
    const mockComment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: 'Użytkownik',
      author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      created_at: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    setComments(prev => [mockComment, ...prev]);
    setNewComment('');
    setIsLoading(false);
    
    toast({
      title: "Komentarz dodany",
      description: "Twój komentarz został pomyślnie dodany.",
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleDislikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, dislikes: comment.dislikes + 1 }
        : comment
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Komentarze ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Dodaj komentarz..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-none border-gray-300 focus:border-youtube-red"
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setNewComment('')}
            disabled={!newComment.trim()}
            className="text-gray-600 hover:text-gray-800"
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            disabled={!newComment.trim() || isLoading}
            className="btn-youtube"
          >
            {isLoading ? 'Dodawanie...' : 'Komentuj'}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Brak komentarzy. Dodaj pierwszy komentarz!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src={comment.author_avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {comment.author}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                      locale: pl
                    })}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 p-0 h-auto"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{comment.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDislikeComment(comment.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 p-0 h-auto"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-xs">{comment.dislikes}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
