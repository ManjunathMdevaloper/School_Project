package com.softgv.management.service.impl;

import com.softgv.management.entity.Outpass;
import com.softgv.management.entity.Student;
import com.softgv.management.repository.OutpassRepository;
import com.softgv.management.repository.StudentRepository;
import com.softgv.management.service.OutpassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OutpassServiceImpl implements OutpassService {

    @Autowired
    private OutpassRepository outpassRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    @Transactional
    public Outpass requestOutpass(Outpass outpass) {
        // Robust Student Lookup
        if (outpass.getStudent() != null) {
            Student existingStudent = null;
            if (outpass.getStudent().getId() != null) {
                existingStudent = studentRepository.findById(outpass.getStudent().getId()).orElse(null);
            }
            // Fallback: If ID wasn't sent but AdmissionNo was (common in some JSON
            // payloads)
            if (existingStudent == null && outpass.getStudent().getAdmissionNo() != null) {
                existingStudent = studentRepository.findByAdmissionNo(outpass.getStudent().getAdmissionNo())
                        .orElse(null);
            }

            if (existingStudent != null) {
                outpass.setStudent(existingStudent);
            } else {
                // If we absolutely cannot find the student, we can't save the outpass
                throw new RuntimeException("Student not found for Outpass request");
            }
        }

        outpass.setStatus("PENDING");
        return outpassRepository.save(outpass);
    }

    @Override
    public List<Outpass> getAllOutpasses() {
        return outpassRepository.findAll();
    }

    @Override
    public List<Outpass> getOutpassesByStudent(Long studentId) {
        return outpassRepository.findByStudentId(studentId);
    }

    @Override
    public Outpass updateOutpassStatus(Long id, String status, String approvedBy) {
        Optional<Outpass> optionalOutpass = outpassRepository.findById(id);
        if (optionalOutpass.isPresent()) {
            Outpass outpass = optionalOutpass.get();
            outpass.setStatus(status);
            outpass.setApprovedBy(approvedBy);
            return outpassRepository.save(outpass);
        }
        return null;
    }
}
