import React from 'react';
import PostCard from './PostCard';
import './PostsSection.css';

class PostsSection extends React.Component {
    render() {
        const { posts } = this.props;
        
        return (
            <section className="posts">
                <section className="post_1">
                    {posts.slice(0, 6).map((post, index) => (
                        <PostCard key={index} post={post} />
                    ))}
                </section>
                {posts[6] && (
                    <section className="post_2">
                        <PostCard post={posts[6]} />
                    </section>
                )}
                {posts.length > 7 && (
                    <section className="post_3">
                        {posts.slice(7).map((post, index) => (
                            <PostCard key={index + 7} post={post} />
                        ))}
                    </section>
                )}
            </section>
        );
    }
}

export default PostsSection;
