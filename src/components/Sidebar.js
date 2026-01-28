import React from 'react';
import './Sidebar.css';

class Sidebar extends React.Component {
    render() {
        const { author, featuredPosts, categories, socials, tags } = this.props;
        
        return (
            <aside className="sidebar">
                <article className="sidebar_author">
                    <article className="sidebar_author_text">
                        <h2>About the author</h2>
                    </article>
                    <article className="sidebar_author_inf">
                        <img src={author.image} alt="author" />
                        <article className="sidebar_author_inf_text">
                            <h2 className="author_name">{author.name}</h2>
                            <h2 className="food_text">{author.role}</h2>
                            <p>{author.description}</p>
                            <hr />
                            <h2 className="continue_reading">Continue Reading</h2>
                        </article>
                    </article>
                </article>

                <article className="sidebar_featured">
                    <article className="sidebar_featured_text">
                        <h2>Featured posts</h2>
                    </article>
                    <article className="sidebar_features_inf">
                        {featuredPosts.map((post, index) => (
                            <article key={index} className={`feature ${index === 0 ? 'first_feature' : index === 1 ? 'second_feature' : 'third_feature'}`}>
                                <img src={post.image} alt={post.alt} />
                                <article className="feature_text">
                                    <h3>{post.category}</h3>
                                    <h2>{post.title}</h2>
                                    <article className="articleText">
                                        <h2>{post.date} <span>By</span> {post.author}</h2>
                                    </article>
                                </article>
                            </article>
                        ))}
                    </article>
                </article>

                <article className="sidebar_categories">
                    <article className="sidebar_categories_text">
                        <h2>Categories</h2>
                    </article>
                    <article className="sidebar_categories_inf">
                        {categories.map((category, index) => (
                            <article key={index} className={index === categories.length - 1 ? 'sidebar_last_category_block' : 'sidebar_categories_block'}>
                                <article className={`category ${index === 0 ? 'first_category' : index === 1 ? 'second_category' : index === 2 ? 'third_category' : index === 3 ? 'fourth_category' : 'fifth_category'}`}>
                                    <h2>{category.name}</h2>
                                    <h2>({category.count})</h2>
                                </article>
                            </article>
                        ))}
                    </article>
                </article>

                <article className="sidebar_socials">
                    <article className="sidebar_socials_text">
                        <h2>Social media</h2>
                    </article>
                    <article className="sidebar_socials_socials">
                        {socials.map((social, index) => (
                            <article key={index} className="social">
                                <img src={social.icon} alt={social.name} />
                                <h3 className={`social_${social.name.toLowerCase()}_text`}>{social.count} {social.label}</h3>
                            </article>
                        ))}
                    </article>
                </article>

                <article className="sidebar_tags">
                    <article className="sidebar_tags_text">
                        <h2>Tags</h2>
                    </article>
                    <article className="sidebar_tags_tags">
                        {tags.map((tag, index) => (
                            <article key={index} className={`${tag.toLowerCase()}_tag`}>
                                <h2>{tag}</h2>
                            </article>
                        ))}
                    </article>
                </article>
            </aside>
        );
    }
}

export default Sidebar;
