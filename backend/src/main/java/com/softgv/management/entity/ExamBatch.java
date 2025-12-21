package com.softgv.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exam_batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ExamBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "exam_batch_classes", joinColumns = @JoinColumn(name = "batch_id"))
    @Column(name = "class_name")
    private List<String> classes = new ArrayList<>();

    @OneToMany(mappedBy = "examBatch", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<SubjectSchedule> subjects = new ArrayList<>();
}
