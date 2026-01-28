import React from 'react';
import { Container, Row, Col, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './ManagementPanel.css';

const ManagementPanel = ({ 
    selectedCount, 
    onAdd, 
    onEdit, 
    onDelete, 
    onSelectAll, 
    onDeselectAll,
    canEdit,
    canDelete,
    canSelectAll
}) => {
    const { t } = useTranslation();
    return (
        <Container fluid className="management-panel px-3 px-md-4 px-lg-5">
            <Row className="align-items-center">
                <Col xs={12} md={6} className="panel-left mb-2 mb-md-0">
                    {canSelectAll && (
                        <ButtonGroup className="me-2">
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={<Tooltip>{t('common.selectAll')}</Tooltip>}
                            >
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={onSelectAll}
                                    className="btn-select-all"
                                >
                                    {t('common.selectAll')}
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={<Tooltip>{t('common.deselectAll')}</Tooltip>}
                            >
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={onDeselectAll}
                                    className="btn-deselect-all"
                                >
                                    {t('common.deselectAll')}
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    )}
                    {selectedCount > 0 && (
                        <Badge bg="primary" className="selected-count-badge ms-2">
                            {selectedCount} {t('common.selected')}
                        </Badge>
                    )}
                </Col>
                <Col xs={12} md={6} className="panel-right text-md-end">
                    <ButtonGroup>
                        <OverlayTrigger 
                            placement="bottom" 
                            overlay={<Tooltip>{t('posts.addPost')}</Tooltip>}
                        >
                            <Button 
                                variant="success" 
                                size="sm"
                                onClick={onAdd}
                                className="btn-add"
                            >
                                + {t('common.add')}
                            </Button>
                        </OverlayTrigger>
                        {canEdit && (
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={
                                    <Tooltip>
                                        {selectedCount === 1 ? t('posts.editPost') : t('posts.editPost')}
                                    </Tooltip>
                                }
                            >
                                <Button 
                                    variant="warning" 
                                    size="sm"
                                    onClick={onEdit} 
                                    disabled={selectedCount !== 1}
                                    className="btn-edit"
                                >
                                    {t('common.edit')}
                                </Button>
                            </OverlayTrigger>
                        )}
                        {canDelete && (
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={
                                    <Tooltip>
                                        {selectedCount > 0 ? t('posts.deletePost') : t('posts.deletePost')}
                                    </Tooltip>
                                }
                            >
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={onDelete} 
                                    disabled={selectedCount === 0}
                                    className="btn-delete"
                                >
                                    {t('common.delete')} ({selectedCount})
                                </Button>
                            </OverlayTrigger>
                        )}
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default ManagementPanel;
