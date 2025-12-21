package com.softgv.management.service;

import com.softgv.management.entity.Faculty;
import java.util.List;
import java.util.Optional;

public interface FacultyService {
    Faculty saveFaculty(Faculty faculty);

    List<Faculty> getAllFaculty();

    Optional<Faculty> getFacultyById(Long id);

    void deleteFaculty(Long id);
}
