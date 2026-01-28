import React from 'react';
import PostCard from './PostCard';
import './PostsSection.css';

const PostsSection = ({ posts, onPostClick, selectedPosts, onPostSelect, showCheckbox }) => {
    return (
        <section className="posts">
            <section className="post_1">
                {posts.slice(0, 6).map((post, index) => (
                    <PostCard 
                        key={post.id || index} 
                        post={post} 
                        onClick={() => onPostClick && onPostClick(post)}
                        isSelected={selectedPosts && selectedPosts.has(post.id)}
                        onSelect={onPostSelect}
                        showCheckbox={showCheckbox}
                    />
                ))}
            </section>
            {posts[6] && (
                <section className="post_2">
                    <PostCard 
                        post={posts[6]} 
                        onClick={() => onPostClick && onPostClick(posts[6])}
                        isSelected={selectedPosts && selectedPosts.has(posts[6].id)}
                        onSelect={onPostSelect}
                        showCheckbox={showCheckbox}
                    />
                </section>
            )}
            {posts.length > 7 && (
                <section className="post_3">
                    {posts.slice(7).map((post, index) => (
                        <PostCard 
                            key={post.id || index + 7} 
                            post={post} 
                            onClick={() => onPostClick && onPostClick(post)}
                            isSelected={selectedPosts && selectedPosts.has(post.id)}
                            onSelect={onPostSelect}
                            showCheckbox={showCheckbox}
                        />
                    ))}
                </section>
            )}
        </section>
    );
};

export default PostsSection;
