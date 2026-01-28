import React from 'react';
import { Pagination as BSPagination, Container, Image } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Pagination.css';

const Pagination = () => {
    const { t } = useTranslation();
    
    const tooltipPrev = (
        <Tooltip id="pagination-prev-tooltip">
            {t('pagination.goToOlder')}
        </Tooltip>
    );
    
    const tooltipNext = (
        <Tooltip id="pagination-next-tooltip">
            {t('pagination.goToNewer')}
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
                
                <span className="pagination-label">{t('pagination.olderPost')}</span>
                
                <BSPagination.Item active>1</BSPagination.Item>
                <BSPagination.Item>2</BSPagination.Item>
                <BSPagination.Item>3</BSPagination.Item>
                <BSPagination.Ellipsis />
                <BSPagination.Item>8</BSPagination.Item>
                
                <span className="pagination-label">{t('pagination.nextPost')}</span>
                
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
