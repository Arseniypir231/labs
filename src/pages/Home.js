import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchPosts, addPost, updatePost, deletePost, clearError } from '../store/slices/postsSlice';
import { openModal, closeModal } from '../store/slices/uiStateSlice';
import { toast } from 'react-toastify';
import Hero from '../components/Hero';
import PostsSection from '../components/PostsSection';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import InstagramWidget from '../components/InstagramWidget';
import PostDetailModal from '../components/PostDetailModal';
import PostFormModal from '../components/PostFormModal';
import ManagementPanel from '../components/ManagementPanel';
import heroData from '../data/hero.json';
import authorData from '../data/author.json';
import featuredPostsData from '../data/featuredPosts.json';
import categoriesData from '../data/categories.json';
import socialsData from '../data/socials.json';
import tagsData from '../data/tags.json';
import instagramData from '../data/instagram.json';

const Home = () => {
    const dispatch = useAppDispatch();
    const { posts, loading, error, validationErrors } = useAppSelector((state) => state.posts);
    const { modalOpen, modalType, selectedItemId } = useAppSelector((state) => state.uiState);
    
    const [hero, setHero] = useState(null);
    const [author, setAuthor] = useState(null);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [socials, setSocials] = useState([]);
    const [tags, setTags] = useState([]);
    const [instagram, setInstagram] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [selectedPosts, setSelectedPosts] = useState(new Set());

    useEffect(() => {
        // Загрузка постов из Redux
        dispatch(fetchPosts());
        
        // Загрузка других данных
        setHero(heroData);
        setAuthor(authorData);
        setFeaturedPosts(featuredPostsData);
        setCategories(categoriesData);
        setSocials(socialsData);
        setTags(tagsData);
        setInstagram(instagramData);
    }, [dispatch]);

    // Обработка ошибок
    useEffect(() => {
        if (error) {
            toast.error(error);
            if (validationErrors) {
                validationErrors.forEach(err => toast.error(err));
            }
            dispatch(clearError());
        }
    }, [error, validationErrors, dispatch]);

    const handlePostClick = (post) => {
        if (selectedPosts.size === 0) {
            setSelectedPost(post);
            dispatch(openModal({ type: 'post', itemId: post.id }));
        }
    };

    const handleCloseModal = () => {
        dispatch(closeModal());
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
        const count = selectedPosts.size;
        if (count > 0 && window.confirm(`Delete ${count} post(s)?`)) {
            selectedPosts.forEach(postId => {
                dispatch(deletePost(postId));
            });
            setSelectedPosts(new Set());
            toast.success(`Deleted ${count} post(s)`);
        }
    };

    const handleSavePost = async (postData, postId) => {
        try {
            if (postId) {
                // Редактирование
                await dispatch(updatePost({ id: postId, postData })).unwrap();
                toast.success('Post updated successfully');
            } else {
                // Добавление
                await dispatch(addPost(postData)).unwrap();
                toast.success('Post added successfully');
            }
            setIsFormModalOpen(false);
            setEditingPost(null);
        } catch (error) {
            // Ошибка уже обработана в useEffect
        }
    };

    if (!hero || !author || !instagram) {
        return <div>Loading...</div>;
    }

    const isModalOpen = modalOpen && modalType === 'post';

    return (
        <>
            <Hero heroData={hero} />
            <div className="main-content-wrapper">
                <div className="container-fluid px-3 px-md-4 px-lg-5">
                    {loading && (
                        <div className="text-center my-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
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
                        <div className="col-12 col-lg-4">
                            <Sidebar 
                                author={author}
                                featuredPosts={featuredPosts}
                                categories={categories}
                                socials={socials}
                                tags={tags}
                            />
                        </div>
                    </div>
                </div>
            </div>
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
