package com.commerce.backend.constants;

import lombok.Data;

@Data
public final class Messages {
    public static final String NOT_FOUND="not found";
    public static final String INTERNAL_SERVER_ERROR = "internal server error";
    public static final String PASSWORD_MISMATCH="password mismatch";
    public static final String REQUIRED_PASSWORD="password is required";
    public static final String UPDATE_PASSWORD="Password updated successfully";
    public static final String REQUIRED_EMAIL="email is required";
    public static final String REQUIRED_FULL_NAME="full name is required";
    public static final String INVALID_OR_EXPIRED_TOKEN="token is invalid or expired";
    public static final String EXIST_USER = "user already exist";
    public static final String INVALID_OR_EXPIRED_OTP = "otp is invalid or expired";
    public static final String ACCOUNT_NOT_ACTIVE="account does not active. check your email!";
    public static final String VERIFICATION_EMAIL="email verification";
    public static final String RESET_PASSWORD="reset password";
    public static final String RESET_PASSWORD_LINK="Reset password link sent to email";
    public static final String COMPLETE_REGISTRATION="registration complete. a confirmation code has been sent to your email.";
    public static final String RESEND_OTP="a new verification code has been sent.";
    public static final String LOGGED_OUT="Logged out";
    public static final String REFRESH_TOKEN="refreshToken";
}
