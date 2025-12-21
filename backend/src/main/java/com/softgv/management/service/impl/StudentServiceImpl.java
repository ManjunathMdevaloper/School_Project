package com.softgv.management.service.impl;

import com.softgv.management.dao.StudentDAO;
import com.softgv.management.entity.Student;
import com.softgv.management.exception.ResourceNotFoundException;
import com.softgv.management.exception.StudentAlreadyExistsException;
import com.softgv.management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentDAO studentDAO;

    @Override
    public Student addStudent(Student student) {
        if (studentDAO.existsByEmail(student.getEmail())) {
            throw new StudentAlreadyExistsException("Student with email " + student.getEmail() + " already exists.");
        }
        return studentDAO.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentDAO.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = getStudentById(id); // Check existence
        studentDAO.deleteById(id);
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);

        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setClassName(studentDetails.getClassName());
        student.setRollNo(studentDetails.getRollNo());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());

        return studentDAO.save(student);
    }
}
