package com.softgv.management.service;

import com.softgv.management.entity.Student;
import java.util.List;

public interface StudentService {
    Student addStudent(Student student);

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    void deleteStudent(Long id);

    Student updateStudent(Long id, Student studentDetails);
}
