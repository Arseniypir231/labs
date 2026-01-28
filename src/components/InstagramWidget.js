import React from 'react';
import './InstagramWidget.css';

class InstagramWidget extends React.Component {
    render() {
        const { instagramImages, instagramName } = this.props;
        
        return (
            <section className="instagram_widget_footer">
                <article className="instagram_widget_footer_text">
                    <h2>Follow our @{instagramName}</h2>
                </article>
                <article className="instagram_widget_footer_img">
                    {instagramImages.map((image, index) => (
                        <img key={index} src={image} alt={`widget_pic_${index + 1}`} />
                    ))}
                </article>
            </section>
        );
    }
}

export default InstagramWidget;
