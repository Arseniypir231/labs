import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PostsSection from './components/PostsSection';
import Sidebar from './components/Sidebar';
import Pagination from './components/Pagination';
import InstagramWidget from './components/InstagramWidget';
import Footer from './components/Footer';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        
        // Данные организации
        this.organizationName = 'Logwork';
        
        // Главный заголовок страницы
        this.mainTitle = 'One of Saturn\'s largest rings may be newer than anyone';
        
        // Меню навигации
        this.menuItems = ['Home', 'Recipes', 'Article', 'Contact', 'Purchase'];
        
        // Данные для Hero секции
        this.heroData = {
            image: '/assets/heroImage.png',
            category: 'Vehicle',
            title: this.mainTitle,
            date: 'June 6, 2019',
            author: 'Rickie Baroch',
            comments: 4
        };
        
        // Массив постов
        this.posts = [
            {
                image: '/assets/Post1.1.jpg',
                alt: 'post_1_1',
                category: 'TOURISM',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/Post1.2.png',
                alt: 'post_1_2',
                category: 'SPORT',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/Post1.3.png',
                alt: 'post_1_3',
                category: 'FASHION',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/Post1.4.png',
                alt: 'post_1_4',
                category: 'CLOTHES',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/Post1.5.png',
                alt: 'post_1_5',
                category: 'CLOTHES',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/Post1.6.png',
                alt: 'post_1_6',
                category: 'FASHION',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/post_2.jpg',
                alt: 'post_2_img',
                category: 'SUMMER',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch',
                comments: 6,
                description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem'
            },
            {
                image: '/assets/post3.1.png',
                alt: 'post_3_1',
                category: 'AUTUMN',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/post3.2.png',
                alt: 'post_3_2',
                category: 'CLOTHES',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/post3.3.png',
                alt: 'post_3_3',
                category: 'SUMMER',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/post3.4.png',
                alt: 'post_3_4',
                category: 'SUMMER',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            }
        ];
        
        // Данные автора для Sidebar
        this.authorData = {
            image: '/assets/author.png',
            name: 'Kate Willems',
            role: 'Food & cooking bloger',
            description: 'Hi, I\'m Sonia. Cooking is the way I express my creative side to the world. Welcome to my Kitchen Corner on…'
        };
        
        // Массив избранных постов
        this.featuredPosts = [
            {
                image: '/assets/jeans_feature.png',
                alt: 'jeans_feature',
                category: 'jeans',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/city_feature.png',
                alt: 'city_feature',
                category: 'city',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            },
            {
                image: '/assets/photography_feature.png',
                alt: 'photography_feature',
                category: 'photography',
                title: this.mainTitle,
                date: 'June 6, 2019',
                author: 'Rickie Baroch'
            }
        ];
        
        // Массив категорий
        this.categories = [
            { name: 'Fashion', count: 23 },
            { name: 'Style & clothes', count: 7 },
            { name: 'Minimalism', count: 16 },
            { name: 'Black & White', count: 5 },
            { name: 'Modern clothes', count: 12 }
        ];
        
        // Массив социальных сетей
        this.socials = [
            { name: 'facebook', icon: '/assets/facebook_social.svg', count: '32k', label: 'likes' },
            { name: 'pinterest', icon: '/assets/pinterest_social.svg', count: '814', label: 'followers' },
            { name: 'vimeo', icon: '/assets/vimeo_social.png', count: '165', label: 'followers' },
            { name: 'dribbble', icon: '/assets/dribbble_social.png', count: '6k', label: 'followers' },
            { name: 'twitter', icon: '/assets/twitter_social.svg', count: '130k', label: 'followers' },
            { name: 'behance', icon: '/assets/behance_social.svg', count: '37k', label: 'followers' },
            { name: 'instagram', icon: '/assets/instagram_social.svg', count: '854k', label: 'followers' },
            { name: 'youtube', icon: '/assets/youtube_social.svg', count: '52k', label: 'subscribers' },
            { name: 'google', icon: '/assets/google+_social.svg', count: '642', label: 'followers' }
        ];
        
        // Массив тегов
        this.tags = ['Business', 'Freelance', 'Money', 'Experience', 'Lifestyle', 'SEO', 'Wordpress', 'Marketing', 'UX', 'Modern', 'Success', 'Nature'];
        
        // Изображения Instagram
        this.instagramImages = [
            '/assets/widget_pic_1.png',
            '/assets/widget_pic_2.jpg',
            '/assets/widget_pic_3.png',
            '/assets/widget_pic_4.png',
            '/assets/widget_pic_5.png',
            '/assets/widget_pic_6.png'
        ];
        
        // Иконки социальных сетей для Footer
        this.socialIcons = [
            '/assets/facebook.png',
            '/assets/twitter_active.png',
            '/assets/pinterest.png',
            '/assets/google_play.png',
            '/assets/behance.png',
            '/assets/instagram.png'
        ];
        
        // Текст копирайта
        this.copyrightText = '@2019 Logwork. All Right Reserved.';
    }
    
    render() {
        return (
            <div className="App">
                <article className="fashion">
                    <Header 
                        organizationName={this.organizationName}
                        menuItems={this.menuItems}
                    />
                </article>
                <main>
                    <Hero heroData={this.heroData} />
                    <article className="posts_and_slidebar">
                        <PostsSection posts={this.posts} />
                        <Sidebar 
                            author={this.authorData}
                            featuredPosts={this.featuredPosts}
                            categories={this.categories}
                            socials={this.socials}
                            tags={this.tags}
                        />
                    </article>
                    <Pagination />
                    <InstagramWidget 
                        instagramImages={this.instagramImages}
                        instagramName="instagram_name"
                    />
                </main>
                <Footer 
                    organizationName={this.organizationName}
                    menuItems={this.menuItems}
                    socialIcons={this.socialIcons}
                    copyrightText={this.copyrightText}
                />
            </div>
        );
    }
}

export default App;
