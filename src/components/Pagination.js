import React from 'react';
import { Pagination as BSPagination, Container, Image } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './Pagination.css';

const Pagination = () => {
    const tooltipPrev = (
        <Tooltip id="pagination-prev-tooltip">
            Go to older posts
        </Tooltip>
    );
    
    const tooltipNext = (
        <Tooltip id="pagination-next-tooltip">
            Go to newer posts
        </Tooltip>
    );
    
    return (
        <Container fluid className="pagination-container">
            <BSPagination className="custom-pagination justify-content-center align-items-center">
                <OverlayTrigger placement="top" overlay={tooltipPrev}>
                    <BSPagination.Prev className="pagination-nav">
                        <Image src="/assets/left_path.svg" alt="left_path" className="pagination-icon" />
                    </BSPagination.Prev>
                </OverlayTrigger>
                
                <span className="pagination-label">OLDER POST</span>
                
                <BSPagination.Item active>1</BSPagination.Item>
                <BSPagination.Item>2</BSPagination.Item>
                <BSPagination.Item>3</BSPagination.Item>
                <BSPagination.Ellipsis />
                <BSPagination.Item>8</BSPagination.Item>
                
                <span className="pagination-label">NEXT POST</span>
                
                <OverlayTrigger placement="top" overlay={tooltipNext}>
                    <BSPagination.Next className="pagination-nav">
                        <Image src="/assets/right_path.svg" alt="right_path" className="pagination-icon" />
                    </BSPagination.Next>
                </OverlayTrigger>
            </BSPagination>
        </Container>
    );
};

export default Pagination;
