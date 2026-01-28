import React from 'react';
import './PostCard.css';

class PostCard extends React.Component {
    render() {
        const { post } = this.props;
        
        return (
            <article className="post-card">
                <img src={post.image} alt={post.alt} />
                <h3 className={post.category === 'SPORT' ? 'sport_h3' : ''}>{post.category}</h3>
                <h2>{post.title}</h2>
                <article className="articleText">
                    <h2>{post.date} <span>By</span> {post.author}</h2>
                    {post.comments && <h2 className="comments_h2">{post.comments} comments</h2>}
                </article>
                {post.description && <p>{post.description}</p>}
            </article>
        );
    }
}

export default PostCard;
