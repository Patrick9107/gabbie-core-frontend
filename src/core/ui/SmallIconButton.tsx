import {IconButton, Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
    onClick: (event: React.MouseEvent) => void;
    toolTip: "Bearbeiten" | "Löschen";
    color?: "error";
}

function SmallIconButton({ onClick, toolTip, color }: Props) {
    return (
        <Tooltip title={toolTip}>
            <IconButton size="small" onClick={onClick}>
                {toolTip == "Bearbeiten" ? <EditIcon color={color} fontSize="small" /> : <DeleteIcon color={color} fontSize="small" />}
            </IconButton>
        </Tooltip>
    );
}

export default SmallIconButton;