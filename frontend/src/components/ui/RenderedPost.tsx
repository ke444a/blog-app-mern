import ReactMarkdown from "react-markdown";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import { Dispatch, SetStateAction } from "react";
import remarkGfm from "remark-gfm";

interface IRenderedPostProps {
  title: string;
  content: string;
  postImage: string;
  isEdit?: boolean;
  setIsEdit?: Dispatch<SetStateAction<boolean>>;
  isEditAllowed?: boolean;
}

const RenderedPost = (props: IRenderedPostProps) => {
    return (
        <Box sx={{ mt: 2 }}>
            {props.postImage && (
                <Box
                    component="img"
                    src={props.postImage}
                    alt="Post image"
                    sx={{
                        display: "flex",
                        width: "auto",
                        maxWidth: "100%",
                        objectFit: "cover",
                        height: "400px",
                        borderRadius: "10px",
                        marginX: "auto"
                    }}
                />
            )}
            <Stack direction={{xs: "column", md: "row"}} justifyContent="space-between" py={3}>
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: "600",
                    }}
                >
                    {props.title}
                </Typography>
                {props?.isEditAllowed && !props?.isEdit && (
                    <Button
                        variant="text"
                        endIcon={<EditIcon />}
                        size="medium"
                        color="primary"
                        sx={{
                            width: "fit-content"
                        }}
                        onClick={() =>
                            props.setIsEdit
                                ? props.setIsEdit((prevState) => !prevState)
                                : null
                        }
                    >
              Edit
                    </Button>
                )}
            </Stack>
            <ReactMarkdown
                components={{
                    p: ({ node, ...props }) => (
                        <Typography
                            variant="body1"
                            {...props}
                            sx={{ fontSize: "1.15em", py: .5 }}
                        />
                    ),
                }}
                remarkPlugins={[remarkGfm]}
            >
                {props.content}
            </ReactMarkdown>
        </Box>
    );
};

export default RenderedPost;
