import React from 'react';
import { Container, Row, Col, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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
    return (
        <Container fluid className="management-panel px-3 px-md-4 px-lg-5">
            <Row className="align-items-center">
                <Col xs={12} md={6} className="panel-left mb-2 mb-md-0">
                    {canSelectAll && (
                        <ButtonGroup className="me-2">
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={<Tooltip>Select all items</Tooltip>}
                            >
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={onSelectAll}
                                    className="btn-select-all"
                                >
                                    Select All
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={<Tooltip>Deselect all items</Tooltip>}
                            >
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={onDeselectAll}
                                    className="btn-deselect-all"
                                >
                                    Deselect All
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    )}
                    {selectedCount > 0 && (
                        <Badge bg="primary" className="selected-count-badge ms-2">
                            {selectedCount} selected
                        </Badge>
                    )}
                </Col>
                <Col xs={12} md={6} className="panel-right text-md-end">
                    <ButtonGroup>
                        <OverlayTrigger 
                            placement="bottom" 
                            overlay={<Tooltip>Add a new item</Tooltip>}
                        >
                            <Button 
                                variant="success" 
                                size="sm"
                                onClick={onAdd}
                                className="btn-add"
                            >
                                + Add New
                            </Button>
                        </OverlayTrigger>
                        {canEdit && (
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={
                                    <Tooltip>
                                        {selectedCount === 1 ? "Edit selected item" : "Select exactly one item to edit"}
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
                                    Edit
                                </Button>
                            </OverlayTrigger>
                        )}
                        {canDelete && (
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={
                                    <Tooltip>
                                        {selectedCount > 0 ? `Delete ${selectedCount} selected item(s)` : "Select items to delete"}
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
                                    Delete ({selectedCount})
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
