package com.actforgood.payment.controller;

import com.actforgood.payment.model.Payment;
import com.actforgood.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        try {
            Payment processed = paymentService.processPayment(payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(processed);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable String id) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<Payment>> getPaymentsByDonor(@PathVariable String donorId) {
        return ResponseEntity.ok(paymentService.getPaymentsByDonor(donorId));
    }
    
    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<Payment>> getPaymentsByCampaign(@PathVariable String campaignId) {
        return ResponseEntity.ok(paymentService.getPaymentsByCampaign(campaignId));
    }
}
