import React from 'react';
import './Pagination.css';

const Pagination = () => {
    return (
        <article className="pagination">
            <img src="/assets/left_path.svg" alt="left_path" className="left_path" />
            <h4 className="older_post">OLDER POST</h4>
            <article className="numbers">
                <h4>1</h4>
                <h4>2</h4>
                <h4>3</h4>
                <h4>...</h4>
                <h4>8</h4>
            </article>
            <h4 className="next_post">NEXT POST</h4>
            <img src="/assets/right_path.svg" alt="right_path" className="right_path" />
        </article>
    );
};

export default Pagination;
