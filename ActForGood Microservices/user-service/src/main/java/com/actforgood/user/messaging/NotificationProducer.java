package com.actforgood.user.messaging;

import com.actforgood.user.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendEmailNotification(NotificationRequest request) {
        log.info("Publishing notification to RabbitMQ: {}", request.getTemplate());
        rabbitTemplate.convertAndSend("notification-exchange", "notification.email", request);
    }
}
