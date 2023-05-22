import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../features/auth/authSlice";
import CustomContainer from "../components/ui/CustomContainer";
import { PostContext } from "../context/PostContext";
import { useGetUser } from "../hooks/users/useGetUser";
import PostList from "../components/ui/PostList";

const Profile = () => {
    const username: string = useLocation().pathname.split("/")[2];
    const accessToken: string = useSelector(selectCurrentToken);
    const user: User = useSelector(selectCurrentUser);

    const userInfoQuery = useGetUser(username, accessToken);
    if (!userInfoQuery.isSuccess) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper
                sx={{
                    padding: "25px 0",
                    width: "100%",
                    marginBottom: "20px",
                }}
                elevation={2}
                square
            >
                <CustomContainer
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    {userInfoQuery.data?.avatar && (
                        <Box
                            component="img"
                            sx={{
                                width: "200px",
                                height: "200px",
                                borderRadius: "50%",
                                marginRight: "25px",
                            }}
                            src={userInfoQuery.data?.avatar}
                            alt=""
                        />
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Typography variant="h2">
                                {userInfoQuery.data?.fullName}
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    opacity: 0.5,
                                    marginBottom: "20px",
                                    fontSize: ".9em",
                                    fontWeight: 500,
                                }}
                            >
                  @{userInfoQuery.data?.username}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 500,
                                    maxWidth: "95%",
                                }}
                            >
                                {userInfoQuery.data?.bio}
                            </Typography>
                        </Box>
                        {user.username === username && (
                            <Stack spacing={1} sx={{ marginLeft: 2 }}>
                                <Button
                                    size="medium"
                                    color="info"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 500,
                                        borderRadius: "10px",
                                        textTransform: "initial",
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="medium"
                                    color="error"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 500,
                                        borderRadius: "10px",
                                        textTransform: "initial",
                                    }}
                                >
                                    Logout
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </CustomContainer>
            </Paper>
            <CustomContainer>
                <Typography variant="h3" gutterBottom>
            Published Blogs
                </Typography>
                <PostContext.Provider value="profile">
                    <PostList 
                        userProfileId={userInfoQuery.data?._id}
                    />
                </PostContext.Provider>
            </CustomContainer>
        </Box>
    );
};

export default Profile;