import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { formatDate } from "../../utils/formatDate";
import { useContext, useState } from "react";
import { PostContext } from "../../context/PostContext";
import { useGetUser } from "../../hooks/users/useGetUser";
import { useCheckUserLike } from "../../hooks/likes/useCheckUserLike";
import { useLikePost } from "../../hooks/likes/useLikePost";
import { useDislikePost } from "../../hooks/likes/useDislikePost";

type PostProps = Omit<Post, "_id"> & {id: string, accessToken: string, userId: string};

const PostPreview = (props: PostProps) => {
    const context = useContext(PostContext);
    const [likesNumber, setLikesNumber] = useState<number>(props.likesNumber);
    const [isLikedPost, setIsLikedPost] = useState<boolean>(false);

    const likeMutation = useLikePost(props.accessToken);
    const dislikeMutation = useDislikePost(props.accessToken);
    const authorQuery = useGetUser(props.authorId, props.accessToken);
    const onCheckUserLikeSuccess = (data: { isLiked: boolean }) => {
        setIsLikedPost(data.isLiked);
    };
    const checkUserLike = useCheckUserLike(props.userId, props.id, props.accessToken, onCheckUserLikeSuccess);

    const handleLikePost = async () => {
        const data = {
            postId: props.id,
            userId: props.userId
        };
        const isLiked: boolean = isLikedPost;
        setIsLikedPost((prevState) => !prevState);

        if (isLiked) {
            setLikesNumber((prevNum) => prevNum - 1);
            dislikeMutation.mutate(data);
        } else {
            setLikesNumber((prevNum) => prevNum + 1);
            likeMutation.mutate(data);
        }
    };

    if (!authorQuery.isSuccess || !checkUserLike.isSuccess) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                marginBottom: "20px",
            }}
        >
            <Box
                component={NavLink}
                to={`/post/${props.id}`}
                sx={{
                    display: "block",
                    marginRight: "15px",
                    transition: "opacity 0.2s ease-in-out",
                    cursor: "pointer",
                    textDecoration: "none",

                    "&:hover": {
                        opacity: 0.9,
                    },
                }}
            >
                <Box
                    component="img"
                    sx={{
                        width: context === "homepage" ? "320px" : "260px",
                        height: context === "homepage" ? "275px" : "220px",
                        objectFit: "cover",
                        borderRadius: "5%",
                    }}
                    src={props.postImg}
                    alt=""
                />
            </Box>
            <Box>
                <Box
                    component={NavLink}
                    to={`/post/${props.id}`}
                    sx={{
                        display: "inline-block",
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: context === "homepage" ? "1.5em" : "1.3em",
                        marginBottom: "5px",
                        color: "inherit",
                        textDecoration: "none",
                        transition: "text-decoration 0.2s ease-in-out",
                        lineHeight: 1.2,

                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    {props.title}
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        marginBottom: 2,
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            opacity: 0.8,
                            fontWeight: 700,
                        }}
                    >
                        <Box
                            to={`/profile/${authorQuery.data._id}`}
                            component={NavLink}
                            sx={{
                                color: "inherit",
                                textUnderlineOffset: "2px",
                            }}
                        >
                            {authorQuery.data.fullName}
                        </Box>{" "}
              | {formatDate(props.createdAt)}
                    </Box>
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        marginBottom: 2,
                        textAlign: "justify",
                        maxWidth: "90%",
                        fontSize: context === "homepage" ? "inherit" : "16px",
                    }}
                >
                    {props.preview}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="text"
                        startIcon={
                            isLikedPost ? (
                                <FavoriteOutlinedIcon />
                            ) : (
                                <FavoriteBorderOutlinedIcon />
                            )
                        }
                        size={context === "homepage" ? "medium" : "small"}
                        onClick={handleLikePost}
                    >
                        {likesNumber}
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<ChatBubbleOutlineIcon />}
                        size={context === "homepage" ? "medium" : "small"}
                    >
                        {props.comments.length}
                    </Button>
                    <Button
                        variant="outlined"
                        color="info"
                        endIcon={<ArrowForwardIosIcon />}
                        component={NavLink}
                        to={`/post/${props.id}`}
                        size={context === "homepage" ? "medium" : "small"}
                    >
              Read More
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default PostPreview;
