package com.softgv.management.service;

import com.softgv.management.entity.Outpass;
import java.util.List;

public interface OutpassService {
    Outpass requestOutpass(Outpass outpass);

    List<Outpass> getAllOutpasses();

    List<Outpass> getOutpassesByStudent(Long studentId);

    Outpass updateOutpassStatus(Long id, String status, String approvedBy);
}
