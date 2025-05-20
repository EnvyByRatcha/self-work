import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEnforceFocus
      disableRestoreFocus
      PaperProps={{
        sx: {
          outline: "2px solid",
          outlineColor: "outline.color",
          borderRadius: "8px",
        },
      }}
    >
      <Box
        sx={{
          padding: 2,
          bgcolor: "background.paper",
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary" }}>
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
