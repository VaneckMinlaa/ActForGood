package com.actforgood.notification.service;

public interface EmailService {
    void sendApprovalEmail(String toEmail, String firstName, String temporaryPassword);
    void sendRejectionEmail(String toEmail, String firstName, String reason);
}
