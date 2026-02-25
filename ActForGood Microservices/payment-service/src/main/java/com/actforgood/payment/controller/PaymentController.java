package com.actforgood.payment.controller;

import com.actforgood.payment.dto.ApiResponse;
import com.actforgood.payment.dto.CreatePaymentRequest;
import com.actforgood.payment.dto.PaymentDTO;
import com.actforgood.payment.model.Payment;
import com.actforgood.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentDTO>> processPayment(
        @Valid @RequestBody CreatePaymentRequest request
    ) {
        log.info("POST /api/payments - Processing payment");

        PaymentDTO payment = paymentService.processPayment(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Payment processed successfully", payment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPayment(@PathVariable UUID id) {
        log.info("GET /api/payments/{}", id);

        PaymentDTO payment = paymentService.getPaymentById(id);

        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PaymentDTO>>> getAllPayments(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/payments - Paginated list: page={}, size={}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentDTO> payments = paymentService.getAllPayments(pageable);

        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<ApiResponse<Page<PaymentDTO>>> getPaymentsByDonor(
        @PathVariable UUID donorId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/payments/donor/{} - page={}, size={}", donorId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentDTO> payments = paymentService.getPaymentsByDonor(donorId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Donor payments retrieved successfully", payments));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<Page<PaymentDTO>>> getPaymentsByCampaign(
        @PathVariable UUID campaignId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/payments/campaign/{} - page={}, size={}", campaignId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentDTO> payments = paymentService.getPaymentsByCampaign(campaignId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Campaign payments retrieved successfully", payments));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<PaymentDTO>>> getPaymentsByStatus(
        @PathVariable String status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/payments/status/{} - page={}, size={}", status, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
        Page<PaymentDTO> payments = paymentService.getPaymentsByStatus(paymentStatus, pageable);

        return ResponseEntity.ok(ApiResponse.success("Payments by status retrieved successfully", payments));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<Page<PaymentDTO>>> getCompletedPayments(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/payments/completed - page={}, size={}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentDTO> payments = paymentService.getCompletedPayments(pageable);

        return ResponseEntity.ok(ApiResponse.success("Completed payments retrieved successfully", payments));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentByTransactionId(
        @PathVariable String transactionId
    ) {
        log.info("GET /api/payments/transaction/{}", transactionId);

        PaymentDTO payment = paymentService.getPaymentByTransactionId(transactionId);

        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment));
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentDTO>> refundPayment(@PathVariable UUID id) {
        log.info("PUT /api/payments/{}/refund", id);

        PaymentDTO payment = paymentService.refundPayment(id);

        return ResponseEntity.ok(ApiResponse.success("Payment refunded successfully", payment));
    }
}
