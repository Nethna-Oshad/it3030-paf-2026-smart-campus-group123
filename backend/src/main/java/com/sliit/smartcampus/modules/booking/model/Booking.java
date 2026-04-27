package com.sliit.smartcampus.modules.booking.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.sliit.smartcampus.common.enums.BookingStatus;

import lombok.Data;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    
    private String facilityId; 
    private String facilityName; 
    
    private String userId; 
    private String userName; 
    
    private String purpose;
    private int attendees;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    private BookingStatus status = BookingStatus.PENDING; 
    
    // --- NEW: QR CODE CHECK-IN TRACKER ---
    private boolean checkedIn = false; 

    private LocalDateTime createdAt = LocalDateTime.now();
}