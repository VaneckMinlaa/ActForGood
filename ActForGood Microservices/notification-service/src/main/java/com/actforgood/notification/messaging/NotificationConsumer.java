package com.actforgood.notification.messaging;

import com.actforgood.notification.dto.NotificationRequest;
import com.actforgood.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final EmailService emailService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "notification-email-queue", durable = "true"),
            exchange = @Exchange(value = "notification-exchange", type = "topic"),
            key = "notification.email"
    ))
    public void consumeEmailNotification(NotificationRequest request) {
        log.info("Received notification request from user-service for: {}", request.getTo());
        
        if ("APPROVAL".equals(request.getTemplate())) {
            emailService.sendApprovalEmail(request.getTo(), request.getFirstName(), request.getVariable());
        } else if ("REJECTION".equals(request.getTemplate())) {
            emailService.sendRejectionEmail(request.getTo(), request.getFirstName(), request.getVariable());
        } else {
            log.warn("Unknown notification template: {}", request.getTemplate());
        }
    }
}
