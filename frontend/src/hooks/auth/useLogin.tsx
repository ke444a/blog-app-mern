import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/auth";

export const useLogin = (onSuccessFunc: (data: UserReturnData) => void ) => {
    return useMutation({
        mutationFn: (formData: UserLoginCredentials) => loginUser(formData),
        onSuccess: (data: UserReturnData) => onSuccessFunc(data),
    });
};