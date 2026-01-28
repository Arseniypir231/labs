import React from 'react';
import Tooltip from './Tooltip';
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
        <div className="management-panel">
            <div className="panel-left">
                {canSelectAll && (
                    <>
                        <Tooltip text="Select all items" position="bottom">
                            <button onClick={onSelectAll} className="btn-select-all">
                                Select All
                            </button>
                        </Tooltip>
                        <Tooltip text="Deselect all items" position="bottom">
                            <button onClick={onDeselectAll} className="btn-deselect-all">
                                Deselect All
                            </button>
                        </Tooltip>
                    </>
                )}
                {selectedCount > 0 && (
                    <span className="selected-count">
                        {selectedCount} selected
                    </span>
                )}
            </div>
            <div className="panel-right">
                <Tooltip text="Add a new item" position="bottom">
                    <button onClick={onAdd} className="btn-add">
                        + Add New
                    </button>
                </Tooltip>
                {canEdit && (
                    <Tooltip 
                        text={selectedCount === 1 ? "Edit selected item" : "Select exactly one item to edit"} 
                        position="bottom"
                    >
                        <button 
                            onClick={onEdit} 
                            className="btn-edit"
                            disabled={selectedCount !== 1}
                        >
                            Edit
                        </button>
                    </Tooltip>
                )}
                {canDelete && (
                    <Tooltip 
                        text={selectedCount > 0 ? `Delete ${selectedCount} selected item(s)` : "Select items to delete"} 
                        position="bottom"
                    >
                        <button 
                            onClick={onDelete} 
                            className="btn-delete"
                            disabled={selectedCount === 0}
                        >
                            Delete ({selectedCount})
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default ManagementPanel;
