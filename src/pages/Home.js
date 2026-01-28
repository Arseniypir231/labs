import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import PostsSection from '../components/PostsSection';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import InstagramWidget from '../components/InstagramWidget';
import PostDetailModal from '../components/PostDetailModal';
import PostFormModal from '../components/PostFormModal';
import ManagementPanel from '../components/ManagementPanel';
import postsData from '../data/posts.json';
import heroData from '../data/hero.json';
import authorData from '../data/author.json';
import featuredPostsData from '../data/featuredPosts.json';
import categoriesData from '../data/categories.json';
import socialsData from '../data/socials.json';
import tagsData from '../data/tags.json';
import instagramData from '../data/instagram.json';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [hero, setHero] = useState(null);
    const [author, setAuthor] = useState(null);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [socials, setSocials] = useState([]);
    const [tags, setTags] = useState([]);
    const [instagram, setInstagram] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [selectedPosts, setSelectedPosts] = useState(new Set());
    const [nextId, setNextId] = useState(100);

    useEffect(() => {
        // Загрузка данных из JSON файлов
        const postsWithIds = postsData.map((post, index) => ({
            ...post,
            id: index + 1
        }));
        setPosts(postsWithIds);
        setHero(heroData);
        setAuthor(authorData);
        setFeaturedPosts(featuredPostsData);
        setCategories(categoriesData);
        setSocials(socialsData);
        setTags(tagsData);
        setInstagram(instagramData);
        setNextId(postsWithIds.length + 1);
    }, []);

    const handlePostClick = (post) => {
        if (selectedPosts.size === 0) {
            setSelectedPost(post);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    const handlePostSelect = (postId, isSelected) => {
        setSelectedPosts(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(postId);
            } else {
                newSet.delete(postId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const allIds = posts.map(post => post.id);
        setSelectedPosts(new Set(allIds));
    };

    const handleDeselectAll = () => {
        setSelectedPosts(new Set());
    };

    const handleAdd = () => {
        setEditingPost(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = () => {
        if (selectedPosts.size === 1) {
            const postId = Array.from(selectedPosts)[0];
            const post = posts.find(p => p.id === postId);
            if (post) {
                setEditingPost(post);
                setIsFormModalOpen(true);
            }
        }
    };

    const handleDelete = () => {
        if (selectedPosts.size > 0 && window.confirm(`Delete ${selectedPosts.size} post(s)?`)) {
            setPosts(prev => prev.filter(post => !selectedPosts.has(post.id)));
            setSelectedPosts(new Set());
        }
    };

    const handleSavePost = (postData, postId) => {
        if (postId) {
            // Редактирование
            setPosts(prev => prev.map(post => 
                post.id === postId ? { ...postData, id: postId } : post
            ));
        } else {
            // Добавление
            const newPost = {
                ...postData,
                id: nextId
            };
            setPosts(prev => [...prev, newPost]);
            setNextId(prev => prev + 1);
        }
        setIsFormModalOpen(false);
        setEditingPost(null);
    };

    if (!hero || !author || !instagram) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Hero heroData={hero} />
            <article className="posts_and_slidebar">
                <div style={{ flex: 1 }}>
                    <ManagementPanel
                        selectedCount={selectedPosts.size}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSelectAll={handleSelectAll}
                        onDeselectAll={handleDeselectAll}
                        canEdit={true}
                        canDelete={true}
                        canSelectAll={true}
                    />
                    <PostsSection 
                        posts={posts} 
                        onPostClick={handlePostClick}
                        selectedPosts={selectedPosts}
                        onPostSelect={handlePostSelect}
                        showCheckbox={true}
                    />
                </div>
                <Sidebar 
                    author={author}
                    featuredPosts={featuredPosts}
                    categories={categories}
                    socials={socials}
                    tags={tags}
                />
            </article>
            <Pagination />
            <InstagramWidget 
                instagramImages={instagram.images}
                instagramName={instagram.name}
            />
            <PostDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                post={selectedPost}
            />
            <PostFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingPost(null);
                }}
                post={editingPost}
                onSave={handleSavePost}
            />
        </>
    );
};

export default Home;
