package com.softgv.management.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softgv.management.entity.Student;
import com.softgv.management.entity.User;
import com.softgv.management.repository.StudentRepository;
import com.softgv.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            loadStudentData();
        }
        if (userRepository.count() == 0) {
            loadUserData();
        }
    }

    private void loadUserData() {
        // Create Admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setRole("ADMIN");
            admin.setEmail("admin@school.edu");
            userRepository.save(admin);
        }

        // Create Faculty
        if (userRepository.findByUsername("fac1").isEmpty()) {
            User faculty = new User();
            faculty.setUsername("fac1");
            faculty.setPassword("123");
            faculty.setRole("FACULTY");
            faculty.setEmail("faculty@school.edu");
            userRepository.save(faculty);
        }

        System.out.println("User seeding check complete.");
    }

    private void loadStudentData() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            java.io.InputStream inputStream = getClass().getResourceAsStream("/students.json");

            if (inputStream == null) {
                System.out.println("ERROR: students.json not found in classpath (src/main/resources)");
                return;
            }

            System.out.println("Loading data from classpath: students.json");
            List<StudentDTO> students = mapper.readValue(inputStream, new TypeReference<List<StudentDTO>>() {
            });

            for (StudentDTO dto : students) {
                Student student = new Student();
                student.setAdmissionNo(dto.getAdmissionNo());
                student.setFirstName(dto.getFirstName());
                student.setLastName(dto.getLastName());
                student.setClassName(dto.getClazz()); // Map "class" from JSON to "className"
                student.setRollNo(dto.getRollNo());
                student.setEmail(dto.getEmail());
                student.setPhone(dto.getPhone());
                student.setParentName(dto.getParentName());

                studentRepository.save(student);
            }
            System.out.println("Successfully loaded " + students.size() + " students into database.");

        } catch (IOException e) {
            System.out.println("Unable to save students: " + e.getMessage());
        }
    }

    // DTO class to handle "class" field in JSON which is a reserved keyword in Java
    static class StudentDTO {
        private String admissionNo;
        private String firstName;
        private String lastName;
        private String clazz; // Maps to "class"
        private Integer rollNo;
        private String email;
        private String phone;
        private String parentName;

        // Getters and Setters
        public String getAdmissionNo() {
            return admissionNo;
        }

        public void setAdmissionNo(String admissionNo) {
            this.admissionNo = admissionNo;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        // Custom setter for "class" field in JSON
        @com.fasterxml.jackson.annotation.JsonProperty("class")
        public void setClazz(String clazz) {
            this.clazz = clazz;
        }

        public String getClazz() {
            return clazz;
        }

        public Integer getRollNo() {
            return rollNo;
        }

        public void setRollNo(Integer rollNo) {
            this.rollNo = rollNo;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public String getParentName() {
            return parentName;
        }

        public void setParentName(String parentName) {
            this.parentName = parentName;
        }
    }
}
