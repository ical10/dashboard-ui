import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';
import { blue } from '@mui/material/colors';

import { CommentDataProps } from 'src/types/submission';

export interface SimpleDialogProps {
  open: boolean;
  comments: CommentDataProps[];
  referencedUrl: string;
  onClose: () => void;
}

const CommentDialog = (props: SimpleDialogProps) => {
  const { onClose, comments, referencedUrl, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Comments for {referencedUrl}</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          {comments.map(({ id, comment, issued_by }) => (
            <ListItem key={id} disableGutters>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>{issued_by}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={comment} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
